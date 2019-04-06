import { useRef } from 'react';
import { useItemInteractionTracking } from './ItemInteractionTracker';
import useFormValidation from './useFormValidation';

export default function useValidatableForm() {
  const formRef = useRef();
  const {
    interactWithItem, hasInteractedWithItem, renderItemInteractionProvider,
  } = useItemInteractionTracking();

  const validate = useFormValidation(
    formRef.current ? formRef.current.scrollToItem : null,
    interactWithItem,
  );

  return {
    formRef, interactWithItem, hasInteractedWithItem, renderItemInteractionProvider, validate,
  };
}
