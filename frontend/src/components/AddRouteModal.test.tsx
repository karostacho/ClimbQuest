import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddRouteModal } from './AddRouteModal';

describe('AddRouteModal', () => {
  it('blocks submit and shows an error when no grade is selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddRouteModal isSubmitting={false} onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Route name:'), 'Perfecto Mundo');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Grade must be selected')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the resolved grade_index once a grade is picked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddRouteModal isSubmitting={false} onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Route name:'), 'Perfecto Mundo');
    await user.selectOptions(screen.getByLabelText('French'), '1-');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ route_name: 'Perfecto Mundo', grade_index: 1 }),
    );
  });

  it('disables the submit button and shows a submitting label while isSubmitting is true', () => {
    render(<AddRouteModal isSubmitting onClose={vi.fn()} onSubmit={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Submitting…' });
    expect(button).toBeDisabled();
  });

  it('ignores a submit attempt while already submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddRouteModal isSubmitting onClose={vi.fn()} onSubmit={onSubmit} />);

    // The button is disabled, so dispatch the form's submit event directly
    // to exercise the handleSubmit early-return guard itself.
    const form = document.querySelector('form');
    if (form) form.requestSubmit === undefined ? form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })) : form.requestSubmit();

    await user.click(screen.getByRole('button', { name: 'Submitting…' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
