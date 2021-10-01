import { useCallback } from 'react';

import { FormBodyImperativeHandle } from './Layouts/FormBody';
import { ItemInteractionTrackerContextValue } from './ItemInteractionTracker';
import { TypedFormItem } from '../FormAdmin/FormItemUtils';
import { FormResponse } from './useFormResponse';
import { formResponseValueIsCompleteIfRequired } from '../Models/FormItem';
import { sortFormItems } from '../Models/Form';

function getIncompleteItems(items: TypedFormItem[], response: FormResponse) {
  return items.filter(
    (item) =>
      item.identifier != null &&
      !formResponseValueIsCompleteIfRequired(item, response.form_response_attrs[item.identifier]),
  );
}

export default function useFormValidation(
  scrollToItem: FormBodyImperativeHandle['scrollToItem'],
  interactWithItem: ItemInteractionTrackerContextValue['interactWithItem'],
): (items: TypedFormItem[], response: FormResponse) => boolean {
  return useCallback(
    (items: TypedFormItem[], response: FormResponse) => {
      const incompleteItems = getIncompleteItems(items, response);

      if (incompleteItems.length === 0) {
        return true;
      }

      incompleteItems.forEach((item) => {
        if (item.identifier) {
          interactWithItem(item.identifier);
        }
      });
      scrollToItem(sortFormItems(incompleteItems)[0]);

      return false;
    },
    [scrollToItem, interactWithItem],
  );
}
