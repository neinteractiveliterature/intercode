/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import 'bootstrap.native/dist/bootstrap-native-v4';
import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/application.scss';
import 'react-table/react-table.css';
import '../inflections';

import components from './components';

// adapted from webpacker-react
function mountReactComponents() {
  const toMount = document.querySelectorAll('[data-react-class]');
  toMount.forEach((element) => {
    const component = components[element.getAttribute('data-react-class')];
    const props = JSON.parse((element.attributes['data-react-props'] || { value: '{}' }).value);
    const reactElement = React.createElement(component, props);
    ReactDOM.render(reactElement, element);
  });
}

document.addEventListener('DOMContentLoaded', mountReactComponents);
