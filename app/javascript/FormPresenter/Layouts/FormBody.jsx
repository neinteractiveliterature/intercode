import React, {
  forwardRef, useRef, useCallback, useContext, useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import ErrorDisplay from '../../ErrorDisplay';
import FormItemInput from '../ItemInputs/FormItemInput';
import { formResponseValueIsComplete } from '../../Models/FormItem';
import { ItemInteractionTrackerContext } from '../ItemInteractionTracker';

const FormBody = ({
  // eslint-disable-next-line react/prop-types
  convention, formItems, response, responseValuesChanged, errors,
}, ref) => {
  const itemRefs = useRef(new Map()).current;
  const { interactWithItem, hasInteractedWithItem } = useContext(ItemInteractionTrackerContext);

  const responseValueChanged = useCallback(
    (field, value) => {
      responseValuesChanged({ [field]: value });
    },
    [responseValuesChanged],
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToItem: (item) => {
        const itemRef = itemRefs.get(item.identifier);
        if (itemRef) {
          itemRef.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }),
  );

  return (
    <div>
      {formItems.map((item) => {
        const itemErrors = (errors || {})[item.identifier] || [];
        const errorsForDisplay = (itemErrors.length > 0 ? itemErrors.join(', ') : null);

        return (
          <div
            key={item.id} // identifier might be null but id won't
            ref={(element) => {
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
                item.identifier
                && hasInteractedWithItem(item.identifier)
                && !formResponseValueIsComplete(item, response[item.identifier])
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
};

const RefForwardingFormBody = forwardRef(FormBody);

RefForwardingFormBody.propTypes = {
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  formItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  response: PropTypes.shape({}).isRequired,
  responseValuesChanged: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
};

export default RefForwardingFormBody;
