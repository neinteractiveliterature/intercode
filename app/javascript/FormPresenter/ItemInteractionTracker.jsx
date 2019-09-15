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
    (itemId) => setInteractedItemIds((prevSet) => {
      const newInteractedItemIds = new Set(prevSet);
      newInteractedItemIds.add(itemId);
      return newInteractedItemIds;
    }),
    [],
  );

  const hasInteractedWithItem = useCallback(
    (itemId) => interactedItemIds.has(itemId),
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
