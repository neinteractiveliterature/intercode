/// <reference types="react/next" />
/// <reference types="react-dom/next" />
import * as React from 'react';
import ReactDOM from 'react-dom';

// adapted from webpacker-react
export default function mountReactComponents(components: { [name: string]: React.ComponentType<unknown> }): void {
  const toMount = document.querySelectorAll('[data-react-class]');
  toMount.forEach((element) => {
    const reactClassName = element.getAttribute('data-react-class');
    if (!reactClassName) {
      return;
    }

    const component = components[reactClassName];
    const props = JSON.parse((element.attributes.getNamedItem('data-react-props') || { value: '{}' }).value);
    const reactElement = React.createElement(component, props);
    const root = ReactDOM.createRoot(element);
    root.render(reactElement);
  });
}
