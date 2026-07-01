const runtimeConfig = typeof window !== 'undefined'
  ? window.__VYAPAR_CONFIG__ || {}
  : {};

const readConfigValue = (key) => {
  const runtimeValue = runtimeConfig[key];
  if (typeof runtimeValue === 'string' && runtimeValue.trim()) {
    return runtimeValue.trim();
  }

  const buildValue = import.meta.env[key];
  if (typeof buildValue === 'string' && buildValue.trim()) {
    return buildValue.trim();
  }

  return '';
};

const normalizeUrl = (url) => url.trim().replace(/\/+$/, '');

const normalizeBackendUrl = (url) => {
  const normalized = normalizeUrl(url);
  return normalized
    .replace(/\/api\/v1$/i, '')
    .replace(/\/ws$/i, '');
};

const backendBaseUrl = normalizeBackendUrl(
  readConfigValue('VITE_BASE_API_URL') || 'http://localhost:9090'
);

export const API_BASE = `${backendBaseUrl}/api/v1`;
export const WS_BASE = `${backendBaseUrl}/ws`;
