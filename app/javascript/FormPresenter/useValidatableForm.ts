import { MutableRefObject, useRef } from 'react';
import {
  ItemInteractionTrackerContextValue,
  useItemInteractionTracking,
} from './ItemInteractionTracker';
import useFormValidation from './useFormValidation';
import { FormBodyImperativeHandle } from './Layouts/FormBody';
import { TypedFormItem } from '../FormAdmin/FormItemUtils';
import { FormResponse } from './useFormResponse';

export default function useValidatableForm(): {
  formRef: MutableRefObject<FormBodyImperativeHandle | undefined>;
  itemInteractionTrackingProps: ItemInteractionTrackerContextValue;
  validate: (items: TypedFormItem[], response: FormResponse) => boolean;
} {
  const formRef = useRef<FormBodyImperativeHandle>();
  const itemInteractionTrackingProps = useItemInteractionTracking();

  const validate = useFormValidation(
    formRef.current ? formRef.current.scrollToItem : () => {},
    itemInteractionTrackingProps.interactWithItem,
  );

  return {
    formRef,
    itemInteractionTrackingProps,
    validate,
  };
}
