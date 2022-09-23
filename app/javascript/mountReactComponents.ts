import * as React from 'react';
import { createRoot } from 'react-dom/client';

// adapted from webpacker-react
export default function mountReactComponents(components: { [name: string]: React.ComponentType<unknown> }): void {
  const toMount = document.querySelectorAll('[data-react-class]');
  toMount.forEach((container) => {
    const reactClassName = container.getAttribute('data-react-class');
    if (!reactClassName) {
      return;
    }

    const component = components[reactClassName];
    const props = JSON.parse((container.attributes.getNamedItem('data-react-props') || { value: '{}' }).value);
    const root = createRoot(container);
    root.render(React.createElement(component, props));
  });
}
