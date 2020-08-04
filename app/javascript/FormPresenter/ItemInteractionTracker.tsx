import React, { useState, useCallback } from 'react';

export type ItemInteractionTrackerContextValue = {
  interactWithItem: (itemId: string) => void,
  hasInteractedWithItem: (itemId: string) => boolean,
  interactedItemIds: Set<string>,
};

export const ItemInteractionTrackerContext = (
  React.createContext<ItemInteractionTrackerContextValue>({
    interactWithItem: () => {},
    hasInteractedWithItem: () => false,
    interactedItemIds: new Set(),
  })
);

export function useItemInteractionTracking(): ItemInteractionTrackerContextValue {
  const [interactedItemIds, setInteractedItemIds] = useState(new Set<string>());

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
