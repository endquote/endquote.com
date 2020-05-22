// https://developer.matomo.org/api-reference/tracking-javascript
export function trackEvent(category, action, name, value) {
  const _paq = window._paq || [];
  console.log("trackEvent", { category, action, name, value });
  _paq.push(["trackEvent", category, action, name, value]);
}

// https://developer.matomo.org/guides/spa-tracking
export function trackPageView(url) {
  const _paq = window._paq || [];
  console.log("trackPageView", url || "");
  _paq.push(["setGenerationTimeMs", 0]);
  if (url) {
    _paq.push(["setCustomUrl", url]);
  }
  _paq.push(["trackPageView"]);
}

export function trackComponentEvent(filename, action, name, value) {
  filename = filename.replace(/^components\//, "");
  filename = filename.replace(/^public\/posts\//, "");
  filename = filename.substr(0, filename.lastIndexOf("."));

  trackEvent(filename, action, name, value);
}
