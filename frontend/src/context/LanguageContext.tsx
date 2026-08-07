import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '../i18n/translations';

const STORAGE_KEY = 'climbquest_language';

// localStorage access can throw (privacy mode, disabled storage, or - as
// hit in tests - a jsdom/vitest environment quirk where it's present but
// not fully wired up), so every access is wrapped rather than assumed safe.
function readStoredLanguage(): Language {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'pl' ? 'pl' : 'en';
  } catch {
    return 'en';
  }
}

function writeStoredLanguage(language: Language): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Nothing to do - the choice just won't persist across reloads.
  }
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    writeStoredLanguage(language);
  }, [language]);

  function t(key: TranslationKey): string {
    return translations[language][key];
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
