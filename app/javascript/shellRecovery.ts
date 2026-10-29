// This runs before the app (and its i18n) has loaded, so its copy is intentionally hard-coded English, like
// BootErrorBoundary's.
//
// An inline script for the framework-mode shell's <head> (see root.tsx), which React Router prerenders into
// index.html. If a file the shell names is gone (a cached shell from before a release whose files have been removed, or
// a flaky network), the app never boots, so none of its own recovery code runs and the visitor gets a blank page. This
// runs first and reloads once, which fetches the current shell; if that doesn't help either it shows a plain message
// with a reload button, which is BootErrorBoundary's message for when the failure is this early.
//
// It is a string, not a function, because it has to be inlined as written: it can't import anything, and the bundler
// must not touch it. Keep the reload guard in step with the Rails-rendered shell (ENTRY_SCRIPT_ONERROR in
// application_helper.rb) and BootErrorBoundary: the same key and 15 second window, so switching between the shells
// can't make a reload loop.
export const SHELL_RECOVERY_SCRIPT = `(function () {
  var KEY = 'intercode.entryScriptReloadAt';
  var WINDOW_MS = 15000;
  var done = false;

  function showFallback() {
    function render() {
      var loading = document.querySelector('.custom-loading-indicator');
      if (loading) { loading.style.display = 'none'; }
      var box = document.createElement('div');
      box.setAttribute('role', 'alert');
      box.style.cssText = 'max-width:32rem;margin:4rem auto;padding:0 1rem;font-family:system-ui,sans-serif;text-align:center;line-height:1.5';
      var heading = document.createElement('h1');
      heading.style.fontSize = '1.25rem';
      heading.textContent = 'We couldn\\u2019t finish loading this page';
      var message = document.createElement('p');
      message.textContent = 'This is usually temporary and fixed by reloading. If it keeps happening, try again in a few minutes.';
      var button = document.createElement('button');
      button.type = 'button';
      button.style.cssText = 'margin-top:1rem;padding:0.5rem 1.25rem;font-size:1rem;cursor:pointer';
      button.textContent = 'Reload the page';
      button.onclick = function () { location.reload(); };
      box.appendChild(heading);
      box.appendChild(message);
      box.appendChild(button);
      document.body.appendChild(box);
    }
    if (document.body) { render(); } else { document.addEventListener('DOMContentLoaded', render); }
  }

  function recover() {
    if (done || window.intercodeShellBooted) { return; }
    done = true;
    try {
      var last = Number(sessionStorage.getItem(KEY));
      if (!(last > 0 && Date.now() - last < WINDOW_MS)) {
        sessionStorage.setItem(KEY, String(Date.now()));
        location.reload();
        return;
      }
    } catch (e) {
      // Without sessionStorage there is no way to tell a second failure from a first, so don't risk a reload loop
    }
    showFallback();
  }

  // Resource errors don't bubble, so this has to listen in the capture phase
  window.addEventListener('error', function (event) {
    var el = event.target;
    if (!el || el === window || !el.tagName) { return; }
    var rel = el.tagName === 'LINK' ? String(el.rel) : '';
    if (el.tagName === 'SCRIPT' || rel === 'modulepreload' || rel === 'stylesheet') { recover(); }
  }, true);

  // The shell's boot script imports the entry file dynamically, which fails as a rejected promise
  window.addEventListener('unhandledrejection', function (event) {
    var message = String(event.reason && event.reason.message);
    if (/dynamically imported module|Importing a module script failed/i.test(message)) { recover(); }
  });
})();`;
