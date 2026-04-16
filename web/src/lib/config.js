const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const getEnvVar = (name, fallback = "") => {
  const value = import.meta.env[name];
  if (!value && !fallback) {
    throw new Error(`${name} is not set. Add it to your web environment before starting Vite.`);
  }
  return value || fallback;
};

export const WEB_API_BASE_URL = trimTrailingSlash(getEnvVar("VITE_API_URL", "http://localhost:3000"));
export const WEB_API_URL = `${WEB_API_BASE_URL}/api`;
