import { useState, type FormEvent } from 'react';
import { ROCK_SCALE_LISTS, findRockGradeIndex, formatRockGrade, type RockScale } from '../data/grades';
import type { Route } from '../api/routes';
import { useLanguage } from '../context/LanguageContext';
import { Dropdown } from './Dropdown';
import '../styles/dropdown.css';

interface AddRouteModalProps {
  isSubmitting: boolean;
  // When set, the modal edits this route instead of creating a new one, and
  // is pre-filled with its current values.
  editingRoute?: Route | null;
  // Which scale to display/pre-select the existing grade in when editing -
  // matches whatever scale the journal table is currently showing, so the
  // value the user sees matches what they were just looking at.
  displayScale: RockScale;
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

// Local calendar date, not new Date().toISOString() (which is UTC and would
// show yesterday/tomorrow near midnight depending on timezone).
function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function AddRouteModal({ isSubmitting, editingRoute, displayScale, onClose, onSubmit }: AddRouteModalProps) {
  const { t } = useLanguage();
  const isEditing = !!editingRoute;
  const today = getLocalDateString();
  const [routeName, setRouteName] = useState(editingRoute?.route_name ?? '');
  const [date, setDate] = useState(editingRoute?.climb_date ?? today);
  const [comment, setComment] = useState(editingRoute?.comment ?? '');
  const [selectedScale, setSelectedScale] = useState<RockScale | null>(editingRoute ? displayScale : null);
  const [selectedGrade, setSelectedGrade] = useState(
    editingRoute ? formatRockGrade(editingRoute.grade_index, displayScale) : '',
  );
  const [error, setError] = useState<string | null>(null);

  function handleGradeChange(scale: RockScale, value: string) {
    setSelectedScale(value ? scale : null);
    setSelectedGrade(value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedScale || !selectedGrade) {
      setError(t('modal_gradeRequired'));
      return;
    }
    const gradeIndex = findRockGradeIndex(selectedScale, selectedGrade);
    if (gradeIndex === undefined) {
      setError(t('modal_gradeRequired'));
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
          <h2>{isEditing ? t('modal_editTitle') : t('modal_addTitle')}</h2>
          <div className="modal-add-form-first-line">
            <div className="field">
              <label className="fields-name" htmlFor="route_name">
                {t('modal_routeName')}
              </label>
              <input
                className="field-input"
                type="text"
                placeholder={t('modal_routeNamePlaceholder')}
                id="route_name"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="fields-name" htmlFor="date">
                {t('modal_date')}
              </label>
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
                  {t('modal_comment')}
                </label>
                <input
                  className="field-input"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('modal_commentPlaceholder')}
                />
              </div>
            </div>
          </div>

          <p>{t('modal_chooseScale')}</p>

          <div className="modal-dropdown-section">
            {(Object.keys(ROCK_SCALE_LISTS) as RockScale[]).map((scale) => (
              <div className="grade-dropdowns" key={scale}>
                <label htmlFor={scale}>{SCALE_LABELS[scale]}</label>
                <Dropdown
                  id={scale}
                  value={selectedScale === scale ? selectedGrade : ''}
                  options={ROCK_SCALE_LISTS[scale]}
                  onChange={(value) => handleGradeChange(scale, value)}
                />
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
            <button type="submit" id="submitBtn" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? t('modal_saving')
                  : t('modal_submitting')
                : isEditing
                  ? t('modal_saveChanges')
                  : t('modal_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
