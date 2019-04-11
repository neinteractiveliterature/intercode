import React, {
  useRef, useContext, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import Form from '../../Models/Form';
import FormHeader from './FormHeader';
import FormFooter from './FormFooter';
import FormProgress from './FormProgress';
import FormSection from './FormSection';
import LoadingIndicator from '../../LoadingIndicator';
import { SectionTraversalContext } from '../SectionTraversalContext';

function FormPresenter({
  convention, form, response, responseErrors, responseValuesChanged, isSubmittingResponse,
  isUpdatingResponse, exitButton, submitButton, submitForm, footerContent,
}) {
  const { currentSection } = useContext(SectionTraversalContext);

  const headerRef = useRef();
  const sectionRef = useRef();

  const scrollToTop = useCallback(
    () => {
      if (headerRef.current) {
        headerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [headerRef],
  );

  useEffect(scrollToTop, [currentSection.id]);

  if (!form || !convention || !response) {
    return (
      <div>
        <LoadingIndicator size={4} />
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <FormHeader
        isUpdatingResponse={isUpdatingResponse}
        isSubmittingResponse={isSubmittingResponse}
        ref={headerRef}
      />

      <FormProgress form={form} />

      <div className="card-body pb-0">
        <FormSection
          ref={sectionRef}
          form={form}
          section={currentSection}
          convention={convention}
          response={response}
          errors={responseErrors}
          responseValuesChanged={responseValuesChanged}
        />
      </div>

      <FormFooter
        form={form}
        response={response}
        exitButton={exitButton}
        submitButton={submitButton}
        submitForm={submitForm}
        isSubmittingResponse={isSubmittingResponse}
        scrollToItem={sectionRef.current ? sectionRef.current.scrollToItem : () => { }}
      >
        {footerContent}
      </FormFooter>
    </div>
  );
}

FormPresenter.propTypes = {
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  form: Form.propType.isRequired,
  response: PropTypes.shape({}).isRequired,
  responseErrors: PropTypes.shape({}).isRequired,
  responseValuesChanged: PropTypes.func.isRequired,
  isSubmittingResponse: PropTypes.bool.isRequired,
  isUpdatingResponse: PropTypes.bool.isRequired,
  exitButton: PropTypes.node,
  submitButton: PropTypes.shape({
    caption: PropTypes.string.isRequired,
  }),
  submitForm: PropTypes.func.isRequired,
  footerContent: PropTypes.node,
};

FormPresenter.defaultProps = {
  exitButton: null,
  submitButton: null,
  footerContent: null,
};

export default FormPresenter;
