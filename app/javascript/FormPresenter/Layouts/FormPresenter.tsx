import { useRef, useContext, useEffect } from 'react';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import FormHeader, { FormHeaderProps } from './FormHeader';
import FormFooter, { FormFooterProps } from './FormFooter';
import FormProgress from './FormProgress';
import FormSection, { FormSectionProps } from './FormSection';
import { SectionTraversalContext } from '../SectionTraversalContext';
import { FormBodyImperativeHandle } from './FormBody';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import { FormItemRole } from '../../graphqlTypes.generated';

export type FormPresenterProps = {
  convention: FormSectionProps['convention'];
  response: FormSectionProps['response'];
  form: CommonFormFieldsFragment;
  currentUserViewerRole: FormItemRole;
  currentUserWriterRole: FormItemRole;
  responseErrors: FormSectionProps['errors'];
  responseValuesChanged: FormSectionProps['responseValuesChanged'];
  isSubmittingResponse: FormFooterProps['isSubmittingResponse'];
  isUpdatingResponse: FormHeaderProps['isUpdatingResponse'];
  exitButton: FormFooterProps['exitButton'];
  submitButton: FormFooterProps['submitButton'];
  submitForm: FormFooterProps['submitForm'];
  footerContent: FormFooterProps['children'];
  imageAttachmentConfig?: FormSectionProps['imageAttachmentConfig'];
};

function FormPresenter({
  convention,
  form,
  currentUserViewerRole,
  currentUserWriterRole,
  response,
  responseErrors,
  responseValuesChanged,
  isSubmittingResponse,
  isUpdatingResponse,
  exitButton,
  submitButton,
  submitForm,
  footerContent,
  imageAttachmentConfig,
}: FormPresenterProps): React.JSX.Element {
  const { currentSection } = useContext(SectionTraversalContext);

  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<FormBodyImperativeHandle>(null);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSection?.id]);

  if (!form || !convention || !response || !currentSection) {
    return (
      <div>
        <LoadingIndicator size={4} iconSet="bootstrap-icons" />
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <FormHeader isUpdatingResponse={isUpdatingResponse} isSubmittingResponse={isSubmittingResponse} ref={headerRef} />

      <FormProgress form={form} />

      <div className="card-body pb-0">
        <FormSection
          ref={sectionRef}
          currentUserViewerRole={currentUserViewerRole}
          currentUserWriterRole={currentUserWriterRole}
          formTypeIdentifier={form.form_type}
          section={currentSection}
          convention={convention}
          response={response}
          errors={responseErrors}
          responseValuesChanged={responseValuesChanged}
          imageAttachmentConfig={imageAttachmentConfig}
        />
      </div>

      <FormFooter
        response={response}
        exitButton={exitButton}
        submitButton={submitButton}
        submitForm={submitForm}
        isSubmittingResponse={isSubmittingResponse}
        scrollToItem={sectionRef.current ? sectionRef.current.scrollToItem : () => {}}
      >
        {footerContent}
      </FormFooter>
    </div>
  );
}

export default FormPresenter;
