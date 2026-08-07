import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { AddRouteModal } from './AddRouteModal';
import { LanguageProvider } from '../context/LanguageContext';
import type { Route } from '../api/routes';

const EXISTING_ROUTE: Route = {
  id: 1,
  route_name: 'Perfecto Mundo',
  grade_index: 1,
  climb_date: '2026-01-01',
  comment: 'Soft for the grade',
  created_at: '2026-01-01T00:00:00Z',
};

function renderModal(props: ComponentProps<typeof AddRouteModal>) {
  return render(
    <LanguageProvider>
      <AddRouteModal {...props} />
    </LanguageProvider>,
  );
}

describe('AddRouteModal', () => {
  it('blocks submit and shows an error when no grade is selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderModal({ isSubmitting: false, displayScale: 'french', onClose: vi.fn(), onSubmit });

    await user.type(screen.getByLabelText('Route name:'), 'Perfecto Mundo');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Grade must be selected')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the resolved grade_index once a grade is picked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderModal({ isSubmitting: false, displayScale: 'french', onClose: vi.fn(), onSubmit });

    await user.type(screen.getByLabelText('Route name:'), 'Perfecto Mundo');
    await user.click(screen.getByLabelText('French'));
    await user.click(screen.getByRole('option', { name: '1-' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ route_name: 'Perfecto Mundo', grade_index: 1 }),
    );
  });

  it('disables the submit button and shows a submitting label while isSubmitting is true', () => {
    renderModal({ isSubmitting: true, displayScale: 'french', onClose: vi.fn(), onSubmit: vi.fn() });

    const button = screen.getByRole('button', { name: 'Submitting…' });
    expect(button).toBeDisabled();
  });

  it('ignores a submit attempt while already submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderModal({ isSubmitting: true, displayScale: 'french', onClose: vi.fn(), onSubmit });

    // The button is disabled, so dispatch the form's submit event directly
    // to exercise the handleSubmit early-return guard itself.
    const form = document.querySelector('form');
    if (form) form.requestSubmit === undefined ? form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })) : form.requestSubmit();

    await user.click(screen.getByRole('button', { name: 'Submitting…' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('pre-fills fields and switches to "Save changes" when editing an existing route', () => {
    renderModal({
      isSubmitting: false,
      editingRoute: EXISTING_ROUTE,
      displayScale: 'french',
      onClose: vi.fn(),
      onSubmit: vi.fn(),
    });

    expect(screen.getByLabelText('Route name:')).toHaveValue('Perfecto Mundo');
    expect(screen.getByLabelText('Date:')).toHaveValue('2026-01-01');
    expect(screen.getByLabelText('Comment:')).toHaveValue('Soft for the grade');
    expect(screen.getByLabelText('French')).toHaveTextContent('1-');
    expect(screen.getByRole('heading', { name: 'Edit route' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('submits the edited values with the existing grade already resolved', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderModal({
      isSubmitting: false,
      editingRoute: EXISTING_ROUTE,
      displayScale: 'french',
      onClose: vi.fn(),
      onSubmit,
    });

    const nameInput = screen.getByLabelText('Route name:');
    await user.clear(nameInput);
    await user.type(nameInput, 'Renamed route');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ route_name: 'Renamed route', grade_index: 1 }),
    );
  });
});
