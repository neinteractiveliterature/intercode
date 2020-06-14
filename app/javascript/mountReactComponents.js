import React from 'react';
import ReactDOM from 'react-dom';

// adapted from webpacker-react
export default function mountReactComponents(components) {
  const toMount = document.querySelectorAll('[data-react-class]');
  toMount.forEach((element) => {
    const component = components[element.getAttribute('data-react-class')];
    const props = JSON.parse((element.attributes['data-react-props'] || { value: '{}' }).value);
    const reactElement = React.createElement(component, props);
    ReactDOM.render(reactElement, element);
  });
}
