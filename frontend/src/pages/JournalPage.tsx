import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
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
  const queryClient = useQueryClient();
  const [scale, setScale] = useState<RockScale>('french');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [order, setOrder] = useState<SortOrder>('desc');
  const [modalTarget, setModalTarget] = useState<ModalTarget>('closed');
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: routes = [],
    isPending,
    isError,
  } = useQuery({
    // Scoped by user id so switching accounts on the same tab never shows a
    // previous user's cached rows before the fresh fetch resolves.
    queryKey: ['routes', user?.id, sortBy, order],
    queryFn: () => fetchRoutes(sortBy, order),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['routes', user?.id] });
      setModalTarget('closed');
    },
    onError: () => setActionError('Could not add that route. Please try again.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NewRoute }) => updateRoute(id, data),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['routes', user?.id] });
      setModalTarget('closed');
    },
    onError: () => setActionError('Could not save your changes. Please try again.'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ['routes', user?.id] });
    },
    onError: () => setActionError('Could not delete that route. Please try again.'),
  });

  function toggleOrder(column: SortBy) {
    if (sortBy === column) {
      setOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setOrder('desc');
    }
  }

  return (
    <>
      <div className="graphic-section">
        <img src={background} alt="" />
        <div className="title">
          <h1>Lead climbing journal</h1>
        </div>
      </div>

      <div className="button-route-section">
        <button className="add-route-btn" onClick={() => setModalTarget('new')}>
          Add new route <i className="fa-solid fa-plus" />
        </button>
      </div>

      <div className="routes-section">
        <div className="table-section">
          <div className="grade-filter">
            <label htmlFor="grade-filter">Grade Scale:</label>
            <br />
            <select id="grade-filter" value={scale} onChange={(e) => setScale(e.target.value as RockScale)}>
              {(Object.keys(ROCK_SCALE_LISTS) as RockScale[]).map((option) => (
                <option key={option} value={option}>
                  {SCALE_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          {actionError && (
            <div className="flash-container">
              <div className="flash-message error" role="alert">
                {actionError}
              </div>
            </div>
          )}

          {isPending ? (
            <p>Loading your routes…</p>
          ) : isError ? (
            <p role="alert">Could not load your routes. Please refresh the page.</p>
          ) : (
            <RouteTable
              routes={routes}
              scale={scale}
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
