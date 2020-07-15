import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Form from '../../Models/Form';
import { SectionTraversalContext } from '../SectionTraversalContext';
import useFormValidation from '../useFormValidation';
import { ItemInteractionTrackerContext } from '../ItemInteractionTracker';

function BackButton({ goToPreviousSection }) {
  const { t } = useTranslation();
  return (
    <button className="btn btn-secondary" onClick={goToPreviousSection} type="button">
      <i className="fa fa-chevron-left" />
      {' '}
      {t('forms.general.backButton', 'Back')}
    </button>
  );
}

BackButton.propTypes = {
  goToPreviousSection: PropTypes.func.isRequired,
};

function ContinueButton({ tryNextSection }) {
  const { t } = useTranslation();
  return (
    <button
      className="btn btn-primary"
      onClick={tryNextSection}
      type="button"
    >
      {t('forms.general.continueButton', 'Continue')}
      {' '}
      <i className="fa fa-chevron-right" />
    </button>
  );
}

ContinueButton.propTypes = {
  tryNextSection: PropTypes.func.isRequired,
};

function SubmitButton({ submitButton, trySubmitForm, isSubmittingResponse }) {
  return (
    <button
      className="btn btn-success"
      onClick={trySubmitForm}
      disabled={isSubmittingResponse}
      type="button"
    >
      {submitButton.caption}
    </button>
  );
}

SubmitButton.propTypes = {
  submitButton: PropTypes.shape({
    caption: PropTypes.string.isRequired,
  }).isRequired,
  trySubmitForm: PropTypes.func.isRequired,
  isSubmittingResponse: PropTypes.bool.isRequired,
};

function FormFooter({
  submitForm, isSubmittingResponse, exitButton, submitButton, form,
  response, scrollToItem, children,
}) {
  const {
    currentSectionId, currentSectionIndex, sectionCount, previousSection, nextSection,
  } = useContext(SectionTraversalContext);
  const { interactWithItem } = useContext(ItemInteractionTrackerContext);
  const validate = useFormValidation(scrollToItem, interactWithItem);

  const validateContinue = useCallback(
    () => validate(form.getItemsInSection(currentSectionId), response),
    [currentSectionId, form, response, validate],
  );

  const goToPreviousSection = useCallback(
    () => { previousSection(); },
    [previousSection],
  );

  const tryNextSection = useCallback(
    () => {
      if (validateContinue()) {
        nextSection();
      }
    },
    [validateContinue, nextSection],
  );

  const trySubmitForm = useCallback(
    () => {
      if (validateContinue()) {
        submitForm();
      }
    },
    [validateContinue, submitForm],
  );

  let backButton;
  let continueButton;
  let submitButtonComponent;

  if (currentSectionIndex >= 1) {
    backButton = <BackButton goToPreviousSection={goToPreviousSection} />;
  }

  if (currentSectionIndex < sectionCount - 1) {
    continueButton = <ContinueButton tryNextSection={tryNextSection} />;
  }

  if (submitButton && currentSectionIndex >= sectionCount - 1) {
    submitButtonComponent = (
      <SubmitButton
        submitButton={submitButton}
        trySubmitForm={trySubmitForm}
        isSubmittingResponse={isSubmittingResponse}
        key="submit"
      />
    );
  }

  if (
    backButton == null
    && continueButton == null
    && exitButton == null
    && submitButtonComponent == null
  ) {
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

FormFooter.propTypes = {
  submitForm: PropTypes.func.isRequired,
  isSubmittingResponse: PropTypes.bool.isRequired,
  exitButton: PropTypes.node,
  submitButton: PropTypes.shape({
    caption: PropTypes.string.isRequired,
  }),
  form: Form.propType.isRequired,
  response: PropTypes.shape({}).isRequired,
  scrollToItem: PropTypes.func.isRequired,
  children: PropTypes.node,
};

FormFooter.defaultProps = {
  exitButton: null,
  submitButton: null,
  children: null,
};

export default FormFooter;
