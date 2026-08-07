import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, api, setUnauthorizedHandler } from './client';

function mockFetchOnce(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: response.status !== undefined && response.status >= 200 && response.status < 300,
      status: 200,
      json: async () => ({}),
      ...response,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  setUnauthorizedHandler(null);
});

describe('api client error extraction', () => {
  it('extracts the FastAPI-style "detail" message from a failed response', async () => {
    mockFetchOnce({
      ok: false,
      status: 409,
      json: async () => ({ detail: 'Account already exists' }),
    });

    await expect(api.post('/auth/register', {})).rejects.toMatchObject({
      status: 409,
      message: 'Account already exists',
    });
  });

  it('falls back to statusText when the body has no usable detail', async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => {
        throw new Error('not json');
      },
    });

    await expect(api.get('/routes')).rejects.toMatchObject({
      status: 500,
      message: 'Internal Server Error',
    });
  });

  it('throws an instance of ApiError, not a plain Error', async () => {
    mockFetchOnce({ ok: false, status: 401, json: async () => ({ detail: 'Not authenticated' }) });

    await expect(api.get('/auth/me')).rejects.toBeInstanceOf(ApiError);
  });

  it('calls the registered unauthorized handler on a 401, even though the call still rejects', async () => {
    mockFetchOnce({ ok: false, status: 401, json: async () => ({ detail: 'Not authenticated' }) });
    const handler = vi.fn();
    setUnauthorizedHandler(handler);

    await expect(api.get('/auth/me')).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call the unauthorized handler on other error statuses', async () => {
    mockFetchOnce({ ok: false, status: 404, json: async () => ({ detail: 'Not found' }) });
    const handler = vi.fn();
    setUnauthorizedHandler(handler);

    await expect(api.get('/routes/999')).rejects.toBeInstanceOf(ApiError);
    expect(handler).not.toHaveBeenCalled();
  });

  it('returns undefined for a 204 No Content response instead of parsing a body', async () => {
    mockFetchOnce({ ok: true, status: 204 });

    await expect(api.delete('/routes/1')).resolves.toBeUndefined();
  });
});
