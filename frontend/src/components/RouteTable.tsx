import { formatRockGrade, type RockScale } from '../data/grades';
import type { Route } from '../api/routes';
import type { SortBy, SortOrder } from '../api/routes';
import { useLanguage } from '../context/LanguageContext';

interface RouteTableProps {
  routes: Route[];
  scale: RockScale;
  sortBy: SortBy | null;
  order: SortOrder;
  onToggleDateOrder: () => void;
  onToggleGradeOrder: () => void;
  onEdit: (route: Route) => void;
  onDelete: (id: number) => void;
}

function sortIconClass(column: SortBy, activeSortBy: SortBy | null, order: SortOrder): string {
  if (column !== activeSortBy) return 'fa-sort';
  return order === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
}

export function RouteTable({
  routes,
  scale,
  sortBy,
  order,
  onToggleDateOrder,
  onToggleGradeOrder,
  onEdit,
  onDelete,
}: RouteTableProps) {
  const { t } = useLanguage();

  function handleDelete(id: number) {
    if (window.confirm(t('journal_deleteConfirm'))) {
      onDelete(id);
    }
  }

  return (
    <table id="routes">
      <thead>
        <tr className="headers">
          <th>#</th>
          <th>{t('journal_columnName')}</th>
          <th>
            <button
              type="button"
              className={sortBy === 'grade' ? 'sort-header active' : 'sort-header'}
              onClick={onToggleGradeOrder}
            >
              {t('journal_columnGrade')}
              <i className={`fa-solid ${sortIconClass('grade', sortBy, order)}`} />
            </button>
          </th>
          <th>
            <button
              type="button"
              className={sortBy === 'date' ? 'sort-header active' : 'sort-header'}
              onClick={onToggleDateOrder}
            >
              {t('journal_columnDate')}
              <i className={`fa-solid ${sortIconClass('date', sortBy, order)}`} />
            </button>
          </th>
          <th>{t('journal_columnComment')}</th>
          <th>{t('journal_columnAction')}</th>
        </tr>
      </thead>
      <tbody>
        {routes.map((route, i) => (
          <tr key={route.id}>
            <td>{i + 1}</td>
            <td>{route.route_name}</td>
            <td>{formatRockGrade(route.grade_index, scale)}</td>
            <td>{route.climb_date}</td>
            <td>{route.comment}</td>
            <td>
              <div className="icons-container">
                <div className="icons">
                  <a
                    href="#edit"
                    onClick={(e) => { e.preventDefault(); onEdit(route); }}
                    className="icon-btn fa-regular fa-pen-to-square"
                    title={t('journal_editRouteTooltip')}
                  />
                  <a
                    href="#delete"
                    onClick={(e) => { e.preventDefault(); handleDelete(route.id); }}
                    className="icon-btn fa-regular fa-trash-can"
                    title={t('journal_deleteRouteTooltip')}
                  />
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
