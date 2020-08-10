import React, { forwardRef, useRef, useCallback, useContext, useImperativeHandle } from 'react';

import ErrorDisplay from '../../ErrorDisplay';
import FormItemInput from '../ItemInputs/FormItemInput';
import { formResponseValueIsCompleteIfRequired } from '../../Models/FormItem';
import { ItemInteractionTrackerContext } from '../ItemInteractionTracker';
import { ConventionForFormItemDisplay } from '../ItemDisplays/FormItemDisplay';
import { CommonFormItemFieldsFragment } from '../../Models/commonFormFragments.generated';
import { TypedFormItem } from '../../FormAdmin/FormItemUtils';

export type FormBodyProps = {
  convention: ConventionForFormItemDisplay;
  formItems: TypedFormItem[];
  response: any;
  responseValuesChanged: (newValues: any) => void;
  errors?: { [itemIdentifier: string]: string[] };
};

export type FormBodyImperativeHandle = {
  scrollToItem: (item: CommonFormItemFieldsFragment) => void;
};

const FormBody = forwardRef<FormBodyImperativeHandle, FormBodyProps>(
  (
    {
      // eslint-disable-next-line react/prop-types
      convention,
      formItems,
      response,
      responseValuesChanged,
      errors,
    },
    ref,
  ) => {
    const itemRefs = useRef(new Map<string, HTMLDivElement>()).current;
    const { interactWithItem, hasInteractedWithItem } = useContext(ItemInteractionTrackerContext);

    const responseValueChanged = useCallback(
      (field, value) => {
        responseValuesChanged({ [field]: value });
      },
      [responseValuesChanged],
    );

    useImperativeHandle(ref, () => ({
      scrollToItem: (item: CommonFormItemFieldsFragment) => {
        if (!item.identifier) {
          return;
        }

        const itemRef = itemRefs.get(item.identifier);
        if (itemRef) {
          itemRef.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }));

    return (
      <div>
        {formItems.map((item) => {
          const itemErrors = item.identifier ? (errors || {})[item.identifier] || [] : [];
          const errorsForDisplay = itemErrors.length > 0 ? itemErrors.join(', ') : null;

          return (
            <div
              key={item.id} // identifier might be null but id won't
              ref={(element) => {
                if (!item.identifier) {
                  return;
                }

                if (element == null) {
                  itemRefs.delete(item.identifier);
                } else {
                  itemRefs.set(item.identifier, element);
                }
              }}
            >
              <FormItemInput
                formItem={item}
                convention={convention}
                valueInvalid={
                  !!item.identifier &&
                  hasInteractedWithItem(item.identifier) &&
                  !formResponseValueIsCompleteIfRequired(item, response[item.identifier])
                }
                value={item.identifier ? response[item.identifier] : null}
                onChange={responseValueChanged}
                onInteract={interactWithItem}
              />
              <ErrorDisplay stringError={errorsForDisplay} />
            </div>
          );
        })}
      </div>
    );
  },
);

export default FormBody;
