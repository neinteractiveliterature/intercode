import { useContext, useCallback, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SectionTraversalContext } from '../SectionTraversalContext';
import useFormValidation from '../useFormValidation';
import { ItemInteractionTrackerContext } from '../ItemInteractionTracker';
import { FormResponse } from '../useFormResponse';
import { FormBodyImperativeHandle } from './FormBody';
import { sortAndParseFormItems } from '../../Models/Form';

type BackButtonProps = {
  goToPreviousSection: () => void;
};

function BackButton({ goToPreviousSection }: BackButtonProps) {
  const { t } = useTranslation();
  return (
    <button className="btn btn-secondary" onClick={goToPreviousSection} type="button">
      <>
        <i className="bi-chevron-left" /> {t('forms.general.backButton')}
      </>
    </button>
  );
}

type ContinueButtonProps = {
  tryNextSection: () => void;
};

function ContinueButton({ tryNextSection }: ContinueButtonProps) {
  const { t } = useTranslation();
  return (
    <button className="btn btn-primary" onClick={tryNextSection} type="button">
      <>
        {t('forms.general.continueButton')} <i className="bi-chevron-right" />
      </>
    </button>
  );
}

type SubmitButtonProps = {
  submitButton: {
    caption: ReactNode;
  };
  trySubmitForm: () => void;
  isSubmittingResponse: boolean;
};

function SubmitButton({ submitButton, trySubmitForm, isSubmittingResponse }: SubmitButtonProps) {
  return (
    <button className="btn btn-success" onClick={trySubmitForm} disabled={isSubmittingResponse} type="button">
      {submitButton.caption}
    </button>
  );
}

export type FormFooterProps = {
  submitForm: () => void;
  isSubmittingResponse: boolean;
  exitButton?: ReactNode;
  submitButton?: SubmitButtonProps['submitButton'];
  response: FormResponse;
  scrollToItem: FormBodyImperativeHandle['scrollToItem'];
  children?: ReactNode;
};

function FormFooter({
  submitForm,
  isSubmittingResponse,
  exitButton,
  submitButton,
  response,
  scrollToItem,
  children,
}: FormFooterProps): React.JSX.Element {
  const { currentSection, currentSectionIndex, sectionCount, previousSection, nextSection } =
    useContext(SectionTraversalContext);
  const { interactWithItem } = useContext(ItemInteractionTrackerContext);
  const validate = useFormValidation(scrollToItem, interactWithItem);
  const sectionItems = useMemo(
    () => sortAndParseFormItems(currentSection?.form_items ?? []),
    [currentSection?.form_items],
  );

  const validateContinue = useCallback(() => validate(sectionItems, response), [sectionItems, response, validate]);

  const goToPreviousSection = useCallback(() => {
    previousSection();
  }, [previousSection]);

  const tryNextSection = useCallback(() => {
    if (validateContinue()) {
      nextSection();
    }
  }, [validateContinue, nextSection]);

  const trySubmitForm = useCallback(() => {
    if (validateContinue()) {
      submitForm();
    }
  }, [validateContinue, submitForm]);

  let backButton: ReactNode = null;
  let continueButton: ReactNode = null;
  let submitButtonComponent: ReactNode = null;

  if (currentSectionIndex != null && currentSectionIndex >= 1) {
    backButton = <BackButton goToPreviousSection={goToPreviousSection} />;
  }

  if (currentSectionIndex != null && currentSectionIndex < sectionCount - 1) {
    continueButton = <ContinueButton tryNextSection={tryNextSection} />;
  }

  if (submitButton && currentSectionIndex != null && currentSectionIndex >= sectionCount - 1) {
    submitButtonComponent = (
      <SubmitButton
        submitButton={submitButton}
        trySubmitForm={trySubmitForm}
        isSubmittingResponse={isSubmittingResponse}
        key="submit"
      />
    );
  }

  if (backButton == null && continueButton == null && exitButton == null && submitButtonComponent == null) {
    return <div />;
  }

  return (
    <div className="card-footer">
      <div className="d-flex justify-content-between">
        <div>{backButton}</div>
        <div>
          {exitButton}
          {continueButton}
          {submitButtonComponent}
        </div>
      </div>
      {children}
    </div>
  );
}

export default FormFooter;
