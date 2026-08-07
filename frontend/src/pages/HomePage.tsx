import { useState } from 'react';
import {
  BOULDER_SCALE_LISTS,
  DEFAULT_BOULDER_INDEX,
  DEFAULT_ROCK_INDEX,
  ROCK_SCALE_LISTS,
  findBoulderGradeIndex,
  findRockGradeIndex,
  getBoulderGradeRow,
  getRockGradeRow,
  type BoulderScale,
  type RockScale,
} from '../data/grades';
import { useLanguage } from '../context/LanguageContext';
import { Dropdown } from '../components/Dropdown';
import background from '../assets/photos/background_image.jpg';
import '../styles/home_page.css';
import '../styles/graphic_section.css';
import '../styles/dropdown.css';

const ROCK_SCALE_COLUMN_INDEX: Record<RockScale, number> = { usa: 1, french: 2, uiaa: 3, british: 4, kurtyka: 5 };
const BOULDER_SCALE_COLUMN_INDEX: Record<BoulderScale, number> = { vScale: 1, fontScale: 2 };

export function HomePage() {
  const { t } = useLanguage();
  const [rockIndex, setRockIndex] = useState(DEFAULT_ROCK_INDEX);
  const [boulderIndex, setBoulderIndex] = useState(DEFAULT_BOULDER_INDEX);

  const rockRow = getRockGradeRow(rockIndex);
  const boulderRow = getBoulderGradeRow(boulderIndex);

  function handleRockChange(scale: RockScale, value: string) {
    const index = findRockGradeIndex(scale, value);
    if (index !== undefined) setRockIndex(index);
  }

  function handleBoulderChange(scale: BoulderScale, value: string) {
    const index = findBoulderGradeIndex(scale, value);
    if (index !== undefined) setBoulderIndex(index);
  }

  return (
    <>
      <div className="graphic-section">
        <img src={background} alt="" />
        <div className="title">
          <h1>{t('home_title')}</h1>
        </div>
      </div>

      <div className="climbing-drop">
        <div className="titles">
          <h1>{t('home_leadClimbing')}</h1>
        </div>

        <div className="grade-dropdowns-wrapper">
          {(Object.keys(ROCK_SCALE_LISTS) as RockScale[]).map((scale) => (
            <div className="grade-dropdowns" key={scale}>
              <label htmlFor={scale}>{scaleLabel(scale)}</label>
              <Dropdown
                id={scale}
                value={(rockRow?.[ROCK_SCALE_COLUMN_INDEX[scale]] as string) ?? ''}
                options={ROCK_SCALE_LISTS[scale]}
                onChange={(value) => handleRockChange(scale, value)}
              />
            </div>
          ))}
        </div>

        <div className="titles">
          <h1>Bouldering</h1>
        </div>

        <div className="grade-dropdowns-wrapper">
          {(Object.keys(BOULDER_SCALE_LISTS) as BoulderScale[]).map((scale) => (
            <div className="grade-dropdowns" key={scale}>
              <label htmlFor={scale}>{scale === 'vScale' ? 'V-scale' : 'Font Scale'}</label>
              <Dropdown
                id={scale}
                value={(boulderRow?.[BOULDER_SCALE_COLUMN_INDEX[scale]] as string) ?? ''}
                options={BOULDER_SCALE_LISTS[scale]}
                onChange={(value) => handleBoulderChange(scale, value)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function scaleLabel(scale: RockScale): string {
  switch (scale) {
    case 'usa':
      return 'USA';
    case 'french':
      return 'French';
    case 'uiaa':
      return 'UIAA';
    case 'british':
      return 'British';
    case 'kurtyka':
      return 'Kurtyka';
  }
}
