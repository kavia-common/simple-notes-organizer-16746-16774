const apiBase =
  (typeof globalThis !== 'undefined' &&
    (globalThis as any).__NOTES_API_BASE_URL__) ||
  '/api';

export const environment = {
  production: false,
  // PUBLIC_INTERFACE
  /** Base URL for the backend API. Set this via environment variables in deployment. */
  apiBaseUrl: apiBase,
};
