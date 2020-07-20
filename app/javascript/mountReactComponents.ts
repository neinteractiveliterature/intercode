import React from 'react';
import ReactDOM from 'react-dom';

// adapted from webpacker-react
export default function mountReactComponents(components: { [name: string]: React.ComponentType }) {
  const toMount = document.querySelectorAll('[data-react-class]');
  toMount.forEach((element) => {
    const reactClassName = element.getAttribute('data-react-class');
    if (!reactClassName) { return; }

    const component = components[reactClassName];
    const props = JSON.parse((element.attributes['data-react-props'] || { value: '{}' }).value);
    const reactElement = React.createElement(component, props);
    ReactDOM.render(reactElement, element);
  });
}
