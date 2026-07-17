import { useState, type FormEvent } from 'react';
import { ROCK_SCALE_LISTS, findRockGradeIndex, type RockScale } from '../data/grades';

interface AddRouteModalProps {
  onClose: () => void;
  onSubmit: (data: { route_name: string; grade_index: number; climb_date: string; comment?: string }) => void;
}

const SCALE_LABELS: Record<RockScale, string> = {
  french: 'French',
  kurtyka: 'Kurtyka',
  uiaa: 'UIAA',
  usa: 'USA',
  british: 'British',
};

const today = new Date().toISOString().split('T')[0];

export function AddRouteModal({ onClose, onSubmit }: AddRouteModalProps) {
  const [routeName, setRouteName] = useState('');
  const [date, setDate] = useState(today);
  const [comment, setComment] = useState('');
  const [selectedScale, setSelectedScale] = useState<RockScale | null>(null);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleGradeChange(scale: RockScale, value: string) {
    setSelectedScale(value ? scale : null);
    setSelectedGrade(value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedScale || !selectedGrade) {
      setError('Grade must be selected');
      return;
    }
    const gradeIndex = findRockGradeIndex(selectedScale, selectedGrade);
    if (gradeIndex === undefined) {
      setError('Grade must be selected');
      return;
    }

    onSubmit({ route_name: routeName, grade_index: gradeIndex, climb_date: date, comment: comment || undefined });
  }

  return (
    <div className="modal-section">
      <div className="modal" id="addRouteWindow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-x-btn">
          <span className="close" id="closeModalBtn" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </span>
        </div>

        <form className="modal-add-route-form" onSubmit={handleSubmit}>
          <h2>Add new route to your journal</h2>
          <div className="modal-add-form-first-line">
            <div className="field">
              <label className="fields-name" htmlFor="route_name">
                Route name:
              </label>
              <br />
              <input
                className="field-input"
                type="text"
                placeholder="Eg. Perfecto Mundo"
                id="route_name"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="fields-name" htmlFor="date">
                Date:
              </label>
              <br />
              <input
                className="field-input"
                type="date"
                id="date"
                max={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-add-form-second-line">
            <div className="comment">
              <div className="field-comment">
                <label className="fields-name" htmlFor="comment">
                  Comment:
                </label>
                <br />
                <input
                  className="field-input"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Eg. Rather soft for the grade"
                />
              </div>
            </div>
          </div>

          <p>Choose the scale of your route</p>

          <div className="modal-dropdown-section">
            {(Object.keys(ROCK_SCALE_LISTS) as RockScale[]).map((scale) => (
              <div className="grade-dropdowns" key={scale}>
                <label htmlFor={scale}>{SCALE_LABELS[scale]}</label>
                <br />
                <select
                  id={scale}
                  value={selectedScale === scale ? selectedGrade : ''}
                  onChange={(e) => handleGradeChange(scale, e.target.value)}
                >
                  <option value=""> </option>
                  {ROCK_SCALE_LISTS[scale].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {error && (
            <div className="flash-container">
              <div className="flash-message error" role="alert">
                {error}
              </div>
            </div>
          )}

          <div className="modal-submit-btn">
            <button type="submit" id="submitBtn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
