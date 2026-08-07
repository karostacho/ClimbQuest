import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// RTL's auto-cleanup registration didn't reliably fire in this Vitest setup
// (renders were accumulating in the DOM across tests within a file), so
// it's done explicitly here instead of relying on detection.
afterEach(() => {
  cleanup();
});
