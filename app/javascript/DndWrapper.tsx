import React from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

export default function DndWrapper<P>(WrappedComponent: React.ComponentType<P>) {
  const Wrapper = (props: P) => (
    <DndProvider options={HTML5toTouch}>
      <WrappedComponent {...props} />
    </DndProvider>
  );

  const wrappedComponentDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `DndWrapper(${wrappedComponentDisplayName})`;

  return Wrapper;
}
