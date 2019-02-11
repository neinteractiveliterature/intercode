/* eslint-disable no-console */

const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
require('source-map-support/register');
const requireFromString = require('require-from-string');
const webpackConfig = require('./config/webpack/development');

global.window = {};

const fs = new MemoryFS();
const compiler = webpack({
  ...webpackConfig,
  entry: {
    components: './app/javascript/packs/components.js',
  },
  output: {
    ...webpackConfig.output,
    libraryTarget: 'commonjs2',
  },
});
compiler.outputFileSystem = fs;

console.log('Compiling...');
compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err);
  }

  console.log('Loading components from in-memory filesystem...');
  const componentsFilename = fs.readdirSync(webpackConfig.output.path)
    .find(filename => filename.match(/^components-[0-9a-f]+\.js$/));
  const componentsPathname = `${webpackConfig.output.path}/${componentsFilename}`;
  const componentsCode = fs.readFileSync(componentsPathname, 'utf-8').toString('utf-8');
  const components = requireFromString(componentsCode, componentsFilename).default;

  const app = express();
  app.get('/*', (req, res) => {
    const componentName = req.path.replace(/^\//, '');
    const component = components[componentName];
    if (component) {
      console.info(`Rendering ${componentName}`);
      let renderedComponent;
      try {
        const props = {};
        Object.getOwnPropertyNames(req.query).forEach((key) => {
          props[key] = JSON.parse(req.query[key]);
        });
        renderedComponent = ReactDOMServer.renderToString(React.createElement(component, props));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(error.message);
        return;
      }

      res.set({ 'Content-Type': 'text/html' });
      res.send(renderedComponent);
      res.end();
    } else {
      console.error(`404: Couldn't find component ${componentName}`);
      res.writeHead(404);
      res.end();
    }
  });
  console.log('Listening on port 3030');
  app.listen(3030);
});
