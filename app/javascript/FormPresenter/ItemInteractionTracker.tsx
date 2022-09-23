import { createContext, useState, useCallback, useMemo } from 'react';

export type ItemInteractionTrackerContextValue = {
  interactWithItem: (itemId: string) => void;
  hasInteractedWithItem: (itemId: string) => boolean;
  interactedItemIds: Set<string>;
};

export const ItemInteractionTrackerContext = createContext<ItemInteractionTrackerContextValue>({
  interactWithItem: () => {},
  hasInteractedWithItem: () => false,
  interactedItemIds: new Set(),
});

export function useItemInteractionTracking(): ItemInteractionTrackerContextValue {
  const [interactedItemIds, setInteractedItemIds] = useState(new Set<string>());

  const interactWithItem = useCallback(
    (itemId: string) =>
      setInteractedItemIds((prevSet) => {
        const newInteractedItemIds = new Set(prevSet);
        newInteractedItemIds.add(itemId);
        return newInteractedItemIds;
      }),
    [],
  );

  const hasInteractedWithItem = useCallback((itemId: string) => interactedItemIds.has(itemId), [interactedItemIds]);

  return useMemo(
    () => ({ interactWithItem, hasInteractedWithItem, interactedItemIds }),
    [interactWithItem, hasInteractedWithItem, interactedItemIds],
  );
}
