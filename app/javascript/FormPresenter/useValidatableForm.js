import { useRef } from 'react';
import { useItemInteractionTracking } from './ItemInteractionTracker';
import useFormValidation from './useFormValidation';

export default function useValidatableForm() {
  const formRef = useRef();
  const itemInteractionTrackingProps = useItemInteractionTracking();

  const validate = useFormValidation(
    formRef.current ? formRef.current.scrollToItem : () => {},
    itemInteractionTrackingProps.interactWithItem,
  );

  return {
    formRef, itemInteractionTrackingProps, validate,
  };
}
