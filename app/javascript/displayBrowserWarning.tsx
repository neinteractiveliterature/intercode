// This module is side-effecty, on purpose.  To work properly, it needs to load before all our
// React components, in case the browser is so old that it can't even load the components.

import 'core-js/features/array/reduce';
import 'core-js/features/object/keys';
import 'core-js/features/object/get-own-property-names';
import 'core-js/features/string/split';
import 'core-js/features/string/match';
import 'core-js/features/parse-int';

import { detect } from 'detect-browser';
import includes from 'lodash/includes';

declare global {
  interface Window {
    setDontShowCookie: () => void;
  }
}

const IOS_WEBVIEW_APP_HOSTS = {
  crios: 'Google Chrome on iOS',
  facebook: 'Facebook on iOS',
  fxios: 'Firefox on iOS',
  instagram: 'Instagram on iOS',
};

const BROWSER_NAMES = {
  ...IOS_WEBVIEW_APP_HOSTS,
  chrome: 'Google Chrome',
  'chromium-webview': 'Google Chrome',
  firefox: 'Mozilla Firefox',
  edge: 'Microsoft Edge',
  ie: 'Microsoft Internet Explorer',
  ios: 'Safari',
  'ios-webview': 'Safari',
  safari: 'Safari',
  opera: 'Opera',
};

// cutoff is native URLSearchParams support + async functions + css grid + esmodules
const MIN_SUPPORTED_VERSION = {
  ...Object.keys(IOS_WEBVIEW_APP_HOSTS).reduce(
    (iosVersions, browserName) => ({
      ...iosVersions,
      [browserName]: 12,
    }),
    {},
  ),
  chrome: 63,
  'chromium-webview': 63,
  firefox: 60,
  safari: 12,
  ios: 12,
  'ios-webview': 12,
  opera: 50,
  edge: 18,
};

const SUPPORTED_BROWSERS = Object.getOwnPropertyNames(MIN_SUPPORTED_VERSION);

function getMajorVersion(versionString?: string) {
  if (!versionString) {
    return 0;
  }

  const parts = versionString.split('.');
  if (parts.length < 1) {
    return 0;
  }

  return parseInt(parts[0], 10);
}

function findIosWebviewAppHost(browser: ReturnType<typeof detect>) {
  const iosWebviewAppHost =
    browser?.name && browser.name in IOS_WEBVIEW_APP_HOSTS
      ? IOS_WEBVIEW_APP_HOSTS[browser.name as keyof typeof IOS_WEBVIEW_APP_HOSTS]
      : undefined;

  return iosWebviewAppHost;
}

function renderRecommendation(browser: ReturnType<typeof detect>) {
  const iosWebviewAppHost = findIosWebviewAppHost(browser);

  if (iosWebviewAppHost) {
    return `
      <p class="text-start">
        ${iosWebviewAppHost}
        uses the Safari engine, which ships with iOS itself.  To update it, update your device to
        the latest version of iOS.
      </p>
    `;
  }

  switch (browser?.name ?? 'unknown') {
    case 'chrome':
      return `
        <a href="https://www.google.com/chrome/" class="btn btn-primary me-2">
          Download the latest Chrome
        </a>
      `;
    case 'firefox':
      return `
        <a href="https://www.firefox.com/" class="btn btn-primary me-2">
          Download the latest Firefox
        </a>
      `;
    case 'safari':
      return `
        <p class="text-start">
          To get the latest Safari, update to the latest version of macOS.  Or, you can use
          this site with an up-to-date version of
          <a href="https://www.google.com/chrome/">Google Chrome</a>
          or
          <a href="https://www.firefox.com/">Mozilla Firefox</a>.
        </p>
      `;
    case 'ios':
    case 'ios-webview':
      return `
        <p class="text-start">To get the latest Safari, update to the latest version of iOS.</p>
      `;
    case 'edge':
      return `
        <p class="text-start">To get the latest Edge, run Windows Update.</p>
      `;
    case 'opera':
      return `
        <a href="https://www.opera.com/" class="btn btn-primary me-2">
          Download the latest Opera
        </a>
      `;
    default:
      return `
        <p class="text-start">
          To use this site, we recommend an up-to-date version of
          <a href="https://www.google.com/chrome/">Google Chrome</a>
          or
          <a href="https://www.firefox.com/">Mozilla Firefox</a>.
        </p>
      `;
  }
}

function getWarningMessage(browser: ReturnType<typeof detect>) {
  if (includes(SUPPORTED_BROWSERS, browser?.name)) {
    return 'This version is out of date and might not work correctly with this site.';
  }

  return 'This browser is unsupported on this site.';
}

function setDontShowCookie() {
  document.cookie = 'suppressBrowserWarning=true';
  window.location.reload();
}
window.setDontShowCookie = setDontShowCookie;

function renderBrowserWarning(browser: ReturnType<typeof detect>) {
  const browserName =
    browser?.name && browser.name in BROWSER_NAMES
      ? BROWSER_NAMES[browser.name as keyof typeof BROWSER_NAMES]
      : 'an unknown web browser';

  const wrapperDiv = document.createElement('div');
  wrapperDiv.innerHTML = `
    <div class="container">
      <div class="alert alert-warning">
        <h2 class="mb-4">Unsupported web browser</h2>

        <div class="d-flex align-items-start">
          <h1 class="m-0 me-4">
            <i class="fa fa-exclamation-triangle"></i>
          </h1>
          <div class="flex-grow-1">
            <p>
              You&apos;re viewing this web site with
              <strong>
                ${browserName}
                ${getMajorVersion(browser?.version ?? undefined)}
              </strong>.
              ${getWarningMessage(browser)}
            </p>

            <div class="text-end mt-4">
              ${renderRecommendation(browser)}
              <button
                class="btn btn-secondary"
                type="button"
                onClick="window.setDontShowCookie()"
                style={{ whiteSpace: 'normal' }}
              >
                Don&apos;t show this warning again on this browser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return wrapperDiv;
}

function displayBrowserWarning() {
  if (
    document.cookie.replace(
      /(?:(?:^|.*;\s*)suppressBrowserWarning\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    ) === 'true'
  ) {
    return;
  }

  let browser = detect();
  if (browser?.type === 'bot') {
    return;
  }

  const iosWebviewAppHost = findIosWebviewAppHost(browser);
  if (iosWebviewAppHost && browser?.os === 'iOS') {
    // special handling for iOS apps which are actually just a UIWebView

    const match = navigator.userAgent.match(/iPhone OS (\d+)/);
    if (match) {
      const iosVersion = parseInt(match[1], 10);
      browser = {
        ...browser,
        version: iosVersion.toString(),
      };
    }
  }

  if (includes(SUPPORTED_BROWSERS, browser?.name)) {
    const minVersion =
      browser?.name && browser.name in MIN_SUPPORTED_VERSION
        ? MIN_SUPPORTED_VERSION[browser.name as keyof typeof MIN_SUPPORTED_VERSION]
        : undefined;

    if (minVersion && getMajorVersion(browser?.version ?? undefined) >= minVersion) {
      return;
    }
  }

  const warningDiv = document.createElement('div');
  const noscript = document.getElementById('no-javascript-warning');
  noscript?.parentNode?.insertBefore(warningDiv, noscript);

  const warning = renderBrowserWarning(browser);
  warningDiv.appendChild(warning);
}

try {
  displayBrowserWarning();
} catch (error) {
  // welp
}
