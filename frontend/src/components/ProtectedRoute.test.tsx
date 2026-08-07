import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/journal']}>
      <Routes>
        <Route path="/login" element={<div>login page</div>} />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <div>journal contents</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('renders nothing while auth state is still loading', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = renderProtected();
    expect(container).toBeEmptyDOMElement();
  });

  it('redirects to /login when there is no user', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderProtected();
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('journal contents')).not.toBeInTheDocument();
  });

  it('renders the protected content when a user is present', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: 'Climber', email: 'climber@example.com' },
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderProtected();
    expect(screen.getByText('journal contents')).toBeInTheDocument();
  });
});
