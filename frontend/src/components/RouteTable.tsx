import { formatRockGrade, type RockScale } from '../data/grades';
import type { Route } from '../api/routes';

interface RouteTableProps {
  routes: Route[];
  scale: RockScale;
  onToggleDateOrder: () => void;
  onToggleGradeOrder: () => void;
  onDelete: (id: number) => void;
}

export function RouteTable({ routes, scale, onToggleDateOrder, onToggleGradeOrder, onDelete }: RouteTableProps) {
  function handleDelete(id: number) {
    if (window.confirm('Are you sure you want to delete this route?')) {
      onDelete(id);
    }
  }

  return (
    <table id="routes">
      <thead>
        <tr className="headers">
          <th>#</th>
          <th>Name</th>
          <th>
            <a className="fa-solid fa-sort" href="#sort-grade" onClick={(e) => { e.preventDefault(); onToggleGradeOrder(); }} />
            <a> Grade</a>
          </th>
          <th>
            <a className="fa-solid fa-sort" href="#sort-date" onClick={(e) => { e.preventDefault(); onToggleDateOrder(); }} />
            <a> Date</a>
          </th>
          <th>Comment</th>
          <th>Action</th>
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
                  <a href="#delete" onClick={(e) => { e.preventDefault(); handleDelete(route.id); }} className="fa-regular fa-trash-can fa-xl" />
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
