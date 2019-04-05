import { useCallback } from 'react';

import { getIncompleteItems } from './FormPresenterUtils';

export default function useFormValidation(scrollToItem, interactWithItem) {
  return useCallback(
    (items, response) => {
      const incompleteItems = getIncompleteItems(items, response);

      if (incompleteItems.length === 0) {
        return true;
      }

      incompleteItems.forEach((item) => {
        if (item.identifier) {
          interactWithItem(item.identifier);
        }
      });
      scrollToItem(incompleteItems[0]);

      return false;
    },
    [scrollToItem, interactWithItem],
  );
}
