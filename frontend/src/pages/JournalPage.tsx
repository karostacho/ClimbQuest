import { useMemo, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ROCK_SCALE_LISTS, type RockScale } from '../data/grades';
import {
  createRoute,
  deleteRoute,
  fetchRoutes,
  updateRoute,
  type NewRoute,
  type Route,
  type SortBy,
  type SortOrder,
} from '../api/routes';
import { RouteTable } from '../components/RouteTable';
import { AddRouteModal } from '../components/AddRouteModal';
import background from '../assets/photos/background_image.jpg';
import '../styles/journal_page.css';
import '../styles/graphic_section.css';

const SCALE_LABELS: Record<RockScale, string> = {
  french: 'French',
  kurtyka: 'Kurtyka',
  uiaa: 'UIAA',
  usa: 'USA',
  british: 'British',
};

// Which route the modal is acting on: closed, adding a new one, or editing
// an existing one.
type ModalTarget = 'closed' | 'new' | Route;

export function JournalPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [scale, setScale] = useState<RockScale>('french');
  // null = neither column actively chosen by the user (falls back to the
  // date/desc default below); set once a header is clicked, and cleared
  // again on a third click of the same header.
  const [sortBy, setSortBy] = useState<SortBy | null>('date');
  const [order, setOrder] = useState<SortOrder>('desc');
  const [modalTarget, setModalTarget] = useState<ModalTarget>('closed');
  const [actionError, setActionError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const effectiveSortBy = sortBy ?? 'date';
  const effectiveOrder = sortBy ? order : 'desc';

  const {
    data: routes = [],
    isPending,
    isError,
  } = useQuery({
    // Scoped by user id so switching accounts on the same tab never shows a
    // previous user's cached rows before the fresh fetch resolves.
    queryKey: ['routes', user?.id, effectiveSortBy, effectiveOrder],
    queryFn: () => fetchRoutes(effectiveSortBy, effectiveOrder),
    enabled: !!user,
    // Keep showing the previous page's rows while the new sort order loads
    // instead of dropping back to a bare "Loading…" state - toggling sort
    // used to replace the whole table with a loading message every time.
    placeholderData: keepPreviousData,
  });

  const hasActiveDateFilter = !!fromDate || !!toDate;

  const filteredRoutes = useMemo(() => {
    if (!hasActiveDateFilter) return routes;
    return routes.filter((route) => {
      if (fromDate && route.climb_date < fromDate) return false;
      if (toDate && route.climb_date > toDate) return false;
      return true;
    });
  }, [routes, fromDate, toDate, hasActiveDateFilter]);

  function clearDateFilters() {
    setFromDate('');
    setToDate('');
  }

  const createMutation = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['routes', user?.id] });
      setModalTarget('closed');
    },
    onError: () => setActionError(t('journal_addError')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NewRoute }) => updateRoute(id, data),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['routes', user?.id] });
      setModalTarget('closed');
    },
    onError: () => setActionError(t('journal_saveError')),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['routes', user?.id] });
    },
    onError: () => setActionError(t('journal_deleteError')),
  });

  // Cycles a header through three states: desc -> asc -> neutral (both
  // headers unsorted, back to the date/desc default) -> desc again.
  function toggleOrder(column: SortBy) {
    if (sortBy !== column) {
      setSortBy(column);
      setOrder('desc');
      return;
    }
    if (order === 'desc') {
      setOrder('asc');
    } else {
      setSortBy(null);
      setOrder('desc');
    }
  }

  return (
    <>
      <div className="graphic-section">
        <img src={background} alt="" />
        <div className="title">
          <h1>{t('journal_title')}</h1>
        </div>
      </div>

      <div className="button-route-section">
        <button className="add-route-btn" onClick={() => setModalTarget('new')}>
          {t('journal_addNewRoute')} <i className="fa-solid fa-plus" />
        </button>
      </div>

      <div className="routes-section">
        <div className="table-section">
          <div className="table-filters">
            <div className="grade-filter">
              <label htmlFor="grade-filter">{t('journal_gradeScale')}</label>
              <select id="grade-filter" value={scale} onChange={(e) => setScale(e.target.value as RockScale)}>
                {(Object.keys(ROCK_SCALE_LISTS) as RockScale[]).map((option) => (
                  <option key={option} value={option}>
                    {SCALE_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-filter">
              <div className="date-filter-field">
                <label htmlFor="filter-from">{t('journal_filterFrom')}</label>
                <input
                  id="filter-from"
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="date-filter-field">
                <label htmlFor="filter-to">{t('journal_filterTo')}</label>
                <input
                  id="filter-to"
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <button
                type="button"
                className={hasActiveDateFilter ? 'clear-filters-btn' : 'clear-filters-btn is-hidden'}
                onClick={clearDateFilters}
                disabled={!hasActiveDateFilter}
              >
                {t('journal_clearFilters')}
              </button>
            </div>
          </div>

          {actionError && (
            <div className="flash-container">
              <div className="flash-message error" role="alert">
                {actionError}
              </div>
            </div>
          )}

          {isPending ? (
            <p>{t('journal_loading')}</p>
          ) : isError ? (
            <p role="alert">{t('journal_loadError')}</p>
          ) : filteredRoutes.length === 0 && hasActiveDateFilter ? (
            <p>{t('journal_noRoutesInRange')}</p>
          ) : (
            <RouteTable
              routes={filteredRoutes}
              scale={scale}
              sortBy={sortBy}
              order={order}
              onToggleDateOrder={() => toggleOrder('date')}
              onToggleGradeOrder={() => toggleOrder('grade')}
              onEdit={(route) => setModalTarget(route)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
        </div>

        {modalTarget !== 'closed' && (
          <AddRouteModal
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            editingRoute={modalTarget === 'new' ? null : modalTarget}
            displayScale={scale}
            onClose={() => setModalTarget('closed')}
            onSubmit={(data) => {
              if (modalTarget === 'new') {
                createMutation.mutate(data);
              } else {
                updateMutation.mutate({ id: modalTarget.id, data });
              }
            }}
          />
        )}
      </div>
    </>
  );
}
