import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from './LanguageContext';

// This Node/jsdom/vitest combination's built-in `window.localStorage` isn't
// functional in this environment (setItem/getItem aren't callable - not a
// React or app issue, confirmed by testing raw calls with no React
// involved), so it's stubbed with a real in-memory implementation here to
// actually exercise LanguageContext's persistence logic. The app's own
// try/catch around every localStorage call is what keeps it working
// gracefully in this broken environment in the first place (and would
// equally guard against a real browser with storage disabled).
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMemoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function Probe() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="translated">{t('nav_journal')}</span>
      <button onClick={() => setLanguage('pl')}>switch to pl</button>
    </div>
  );
}

describe('LanguageContext', () => {
  it('defaults to English when nothing is stored', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('translated')).toHaveTextContent('Journal');
  });

  it('switches the active language and the strings t() returns', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'switch to pl' }));

    expect(screen.getByTestId('language')).toHaveTextContent('pl');
    expect(screen.getByTestId('translated')).toHaveTextContent('Dziennik');
  });

  it('persists the chosen language to localStorage and restores it on the next mount', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'switch to pl' }));
    unmount();

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('language')).toHaveTextContent('pl');
  });

  it('throws when used outside a LanguageProvider', () => {
    // Swallow the expected React error-boundary console output for this case.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useLanguage must be used within a LanguageProvider');
    consoleError.mockRestore();
  });
});
