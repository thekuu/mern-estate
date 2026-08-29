export const apiFetch = async (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = (import.meta.env.VITE_API_URL ?? '') + input;
    init = { credentials: 'include', ...init };
  }
  return fetch(input, init);
};
