const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getRequiredEnvVar = (name: "EXPO_PUBLIC_API_URL") => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set. Add it to your mobile environment before starting Expo.`);
  }

  return value;
};

const mobileApiBaseUrl = trimTrailingSlash(getRequiredEnvVar("EXPO_PUBLIC_API_URL"));

export const MOBILE_API_URL = `${mobileApiBaseUrl}/api`;
export const MOBILE_SOCKET_URL = mobileApiBaseUrl;
