import { useCallback } from 'react';

import { FormBodyImperativeHandle } from './Layouts/FormBody';
import { ItemInteractionTrackerContextValue } from './ItemInteractionTracker';
import { TypedFormItem } from '../FormAdmin/FormItemUtils';
import { FormResponse } from './useFormResponse';
import { formResponseValueIsCompleteIfRequired } from '../Models/FormItem';

function getIncompleteItems(items: TypedFormItem[], response: FormResponse) {
  return items.filter((item) => (
    item.identifier != null
    && !formResponseValueIsCompleteIfRequired(item, response[item.identifier])
  ));
}

export default function useFormValidation(
  scrollToItem: FormBodyImperativeHandle['scrollToItem'],
  interactWithItem: ItemInteractionTrackerContextValue['interactWithItem'],
) {
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
