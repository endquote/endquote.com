export const DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const PROD_HREF = "https://endquote.com";

let href = PROD_HREF;
if (typeof window !== "undefined") {
  href = window.location.origin;
} else if (process.env.BASE_HREF) {
  href = process.env.BASE_HREF;
}

export const BASE_HREF = href;

export const BASE_STATIC = "https://static.endquote.com";
export const BASE_HLS = `${BASE_STATIC}/hls`;

export const SUBSCRIBE_API = "https://sendy.endquote.com/subscribe";
export const SUBSCRIBE_LIST = "EsRkEPY6hJvzhxFX0x97jQ";
export const SUBSCRIBE_APIKEY = "U5aIPpJhyeLwMXfqoIJw";
