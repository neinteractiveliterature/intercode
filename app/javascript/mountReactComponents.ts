import * as React from 'react';
import { createRoot } from 'react-dom/client';

// adapted from webpacker-react
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function mountReactComponents(components: { [name: string]: React.ComponentType<any> }): void {
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
