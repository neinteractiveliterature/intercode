// This module is side-effecty, on purpose.  To work properly, it needs to load before all our
// React components, in case the browser is so old that it can't even load the components.

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { detect } from 'detect-browser';

const BROWSER_NAMES = {
  chrome: 'Google Chrome',
  crios: 'Google Chrome on iOS',
  firefox: 'Mozilla Firefox',
  edge: 'Microsoft Edge',
  ie: 'Microsoft Internet Explorer',
  ios: 'Safari',
  'ios-webview': 'Safari',
  safari: 'Safari',
  opera: 'Opera',
};

// kind of arbitrarily choosing CSS Grid support as the cutoff for supported versions
// we don't actually use CSS Grid right now but we might and it's a decent proxy for
// modernity in a browser
const MIN_SUPPORTED_VERSION = {
  chrome: 57,
  crios: 11,
  firefox: 52,
  safari: 11,
  ios: 11,
  'ios-webview': 11,
  opera: 44,
  edge: 16,
};

const SUPPORTED_BROWSERS = Object.getOwnPropertyNames(MIN_SUPPORTED_VERSION);

function getMajorVersion(versionString) {
  if (!versionString) {
    return 0;
  }

  const parts = versionString.split('.');
  if (parts.length < 1) {
    return 0;
  }

  return Number.parseInt(parts[0], 10);
}

function renderRecommendation(browser) {
  switch (browser.name) {
    case 'chrome':
      return (
        <a href="https://www.google.com/chrome/" className="btn btn-primary mr-2">
          Download the latest Chrome
        </a>
      );
    case 'firefox':
      return (
        <a href="https://www.firefox.com/" className="btn btn-primary mr-2">
          Download the latest Firefox
        </a>
      );
    case 'safari':
      return (
        <p className="text-left">
          To get the latest Safari, update to the latest version of macOS.  Or, you can use
          this site with an up-to-date version of
          {' '}
          <a href="https://www.google.com/chrome/">Google Chrome</a>
          {' or '}
          <a href="https://www.firefox.com/">Mozilla Firefox</a>
          .
        </p>
      );
    case 'ios':
    case 'ios-webview':
      return (
        <p className="text-left">To get the latest Safari, update to the latest version of iOS.</p>
      );
    case 'crios':
      return (
        <p className="text-left">
          Chrome for iOS uses the Safari engine, which ships with iOS itself.  To update it,
          update your device to the latest version of iOS.
        </p>
      );
    case 'edge':
      return (
        <p className="text-left">To get the latest Edge, run Windows Update.</p>
      );
    case 'opera':
      return (
        <a href="https://www.opera.com/" className="btn btn-primary mr-2">
          Download the latest Opera
        </a>
      );
    default:
      return (
        <p className="text-left">
          To use this site, we recommend an up-to-date version of
          {' '}
          <a href="https://www.google.com/chrome/">Google Chrome</a>
          {' or '}
          <a href="https://www.firefox.com/">Mozilla Firefox</a>
          .
        </p>
      );
  }
}

function setDontShowCookie() {
  document.cookie = 'suppressBrowserWarning=true';
  window.location.reload();
}

function BrowserWarning({ browser }) {
  const browserName = BROWSER_NAMES[browser.name] || 'an unknown web browser';

  return (
    <div className="container">
      <div className="alert alert-warning">
        <h2 className="mb-4">Unsupported web browser</h2>

        <div className="d-flex align-items-start">
          <h1 className="m-0 mr-4">
            <i className="fa fa-exclamation-triangle" />
          </h1>
          <div className="flex-grow-1">
            <p>
              You&apos;re viewing this web site with
              {' '}
              <strong>
                {browserName}
                {' '}
                {getMajorVersion(browser.version)}
              </strong>
              {'. '}
              {
                SUPPORTED_BROWSERS.includes(browser.name)
                  ? 'This version is out of date and might not work correctly with this site.'
                  : 'This browser is unsupported on this site.'
              }
            </p>

            <div className="text-right mt-4">
              {renderRecommendation(browser)}
              <button
                className="btn btn-secondary"
                type="button"
                onClick={setDontShowCookie}
                style={{ whiteSpace: 'normal' }}
              >
                Don&apos;t show this warning again on this browser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BrowserWarning.propTypes = {
  browser: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
  }),
};

BrowserWarning.defaultProps = {
  browser: null,
};

function displayBrowserWarning() {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)suppressBrowserWarning\s*=\s*([^;]*).*$)|^.*$/, '$1') === 'true') {
    return;
  }

  let browser = detect() || {};
  if (browser.bot) {
    return;
  }

  if (browser.name === 'crios') {
    // special handling for Chrome for iOS, which is actually just a UIWebView

    const match = navigator.userAgent.match(/iPhone OS (\d+)/);
    if (match) {
      const iosVersion = Number.parseInt(match[1], 10);
      browser = {
        name: 'crios',
        version: iosVersion.toString(),
      };
    }
  }

  if (SUPPORTED_BROWSERS.includes(browser.name)) {
    if (getMajorVersion(browser.version) >= MIN_SUPPORTED_VERSION[browser.name]) {
      return;
    }
  }

  const warningDiv = document.createElement('div');
  const noscript = document.getElementById('no-javascript-warning');
  noscript.parentNode.insertBefore(warningDiv, noscript);

  ReactDOM.render(<BrowserWarning browser={browser} />, warningDiv);
}

try {
  displayBrowserWarning();
} catch (error) {
  // welp
}
