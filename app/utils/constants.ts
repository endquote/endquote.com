const runtimeConfig = useRuntimeConfig();
const localDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const remoteDev = runtimeConfig.public.coolifyFqdn !== "endquote.com";
export const DEV = localDev || remoteDev;

export const BASE_OBJECTS = "https://objects-us-east-1.dream.io";
export const BASE_HLS = `${BASE_OBJECTS}/endquote`;
export const BASE_HREF = localDev ? window.location.origin : runtimeConfig.public.coolifyUrl;

export const FEED_COLLECTIONS = ["blog"] as const;
