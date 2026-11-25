// Inlined as written into the <head> of both shells: root.tsx imports it as a string for the framework-mode shell, and
// layouts/_boot_preloads.html.erb reads it for the Rails-rendered ones. So it can't import anything, and the bundler
// and transpiler don't touch it: keep it to what browsers run as is.

// Starts redeeming the refresh cookie now, while the entry script is still downloading. AuthenticationManager's
// bootstrapFromCookie takes this request over, once, instead of making its own, so this must stay the same request it
// would make.
window.intercodeEarlyRefresh = fetch('/oauth_session/refresh', {
  method: 'POST',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: '{}',
});
window.intercodeEarlyRefresh.catch(() => {});

// Fetches /client_configuration now and uses it to set the title and favicon, which a shell without server-rendered tags
// (the framework-mode shell) lacks. The app takes the same promise over instead of fetching again. A failed fetch is
// left for the app to retry and report.
window.intercodeEarlyClientConfiguration = fetch('/client_configuration', { credentials: 'same-origin' }).then(
  (response) => {
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    return response.json();
  },
);
window.intercodeEarlyClientConfiguration
  .then((config) => {
    var convention = config.convention;
    if (!convention) {
      return;
    }
    document.title = convention.name;
    if (convention.favicon_url) {
      var icon = document.querySelector('link[rel="icon"]');
      if (!icon) {
        icon = document.createElement('link');
        icon.rel = 'icon';
        document.head.appendChild(icon);
      }
      if (convention.favicon_content_type) {
        icon.type = convention.favicon_content_type;
      }
      icon.href = convention.favicon_url;
    }
  })
  .catch(() => {});
