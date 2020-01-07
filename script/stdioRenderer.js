// Largely stolen from https://github.com/ReactTraining/react-stdio, but with a different
// way of loading components that doesn't rely on requires from the filesystem

global.window = {};

const EventStream = require('event-stream');
const JSONStream = require('JSONStream');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const React = require('react');
const invariant = require('invariant');
const { Console } = require('console');

// haxxxxxx
React.Suspense = ({ children }) => children;
React.lazy = (component) => component;

const components = require('../app/javascript/packs/components').default;

function renderToStaticMarkup(element, callback) {
  callback(null, ReactDOMServer.renderToStaticMarkup(element));
}

function renderToString(element, callback) {
  callback(null, ReactDOMServer.renderToString(element));
}

function handleRequest(request, callback) {
  const componentName = request.component;
  const renderMethod = request.render;
  const { props, url } = request;

  invariant(componentName != null, 'Missing { component } in request');

  let render;
  if (renderMethod == null || renderMethod === 'renderToString') {
    render = renderToString;
  } else if (renderMethod === 'renderToStaticMarkup') {
    render = renderToStaticMarkup;
  }

  invariant(
    typeof render === 'function',
    'Unknown render method: %s',
    renderMethod,
  );

  const renderRouter = (routerProps) => React.createElement(
    StaticRouter, { ...routerProps, location: url },
  );

  const component = components[componentName];

  invariant(component != null, 'Cannot load component: %s', componentName);

  render(React.createElement(component, { renderRouter, ...props }), (err, html) => {
    callback(err, html, component.context);
  });
}

function requestHandler(request, callback) {
  try {
    handleRequest(request, (error, html, context) => {
      if (error) {
        callback(error);
      } else if (typeof html !== 'string') {
        // Crash the server process.
        callback(new Error('Render method must return a string'));
      } else {
        callback(null, JSON.stringify({ html, context }));
      }
    });
  } catch (error) {
    callback(null, JSON.stringify({ error: error.message }));
  }
}

// Redirect stdout to stderr, but save a reference so we can
// still write to stdout.
const { stdout } = process;
Object.defineProperty(process, 'stdout', {
  configurable: true,
  enumerable: true,
  value: process.stderr,
});

// Ensure console.log knows about the new stdout.
Object.defineProperty(global, 'console', {
  configurable: true,
  enumerable: true,
  value: new Console(process.stdout, process.stderr),
});

// Read JSON blobs from stdin, pipe output to stdout.
process.stdin
  .pipe(JSONStream.parse())
  .pipe(EventStream.map(requestHandler))
  .pipe(stdout);
