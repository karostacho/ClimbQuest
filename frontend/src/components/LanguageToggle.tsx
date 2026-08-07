import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={language === 'en' ? 'language-option active' : 'language-option'}
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <span className="language-divider">|</span>
      <button
        type="button"
        className={language === 'pl' ? 'language-option active' : 'language-option'}
        onClick={() => setLanguage('pl')}
        aria-pressed={language === 'pl'}
      >
        PL
      </button>
    </div>
  );
}
