import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export const ItemInteractionTrackerContext = React.createContext({
  interactWithItem: () => {},
  hasInteractedWithItem: () => false,
  interactedItemIds: new Set(),
});

export function useItemInteractionTracking() {
  const [interactedItemIds, setInteractedItemIds] = useState(new Set());

  const interactWithItem = useCallback(
    itemId => setInteractedItemIds((prevSet) => {
      const newInteractedItemIds = new Set(prevSet);
      newInteractedItemIds.add(itemId);
      return newInteractedItemIds;
    }),
    [],
  );

  const hasInteractedWithItem = useCallback(
    itemId => interactedItemIds.has(itemId),
    [interactedItemIds],
  );

  return { interactWithItem, hasInteractedWithItem, interactedItemIds };
}

export function ItemInteractionProvider({ interactWithItem, hasInteractedWithItem, children }) {
  return (
    <ItemInteractionTrackerContext.Provider value={{ interactWithItem, hasInteractedWithItem }}>
      {children}
    </ItemInteractionTrackerContext.Provider>
  );
}

ItemInteractionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  interactWithItem: PropTypes.func.isRequired,
  hasInteractedWithItem: PropTypes.func.isRequired,
};

export default class ItemInteractionTracker extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      interactedItemIds: new Set(),
    };
  }

  interactWithItem = (itemId) => {
    this.setState((prevState) => {
      const newInteractedItemIds = new Set(prevState.interactedItemIds);
      newInteractedItemIds.add(itemId);
      return { interactedItemIds: newInteractedItemIds };
    });
  }

  hasInteractedWithItem = itemId => this.state.interactedItemIds.has(itemId)

  render = () => (
    <ItemInteractionTrackerContext.Provider
      value={{
        interactWithItem: this.interactWithItem,
        hasInteractedWithItem: this.hasInteractedWithItem,
      }}
    >
      {this.props.children}
    </ItemInteractionTrackerContext.Provider>
  )
}
