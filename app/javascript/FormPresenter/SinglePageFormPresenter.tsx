import { forwardRef, useMemo } from 'react';

import { getSortedParsedFormItems } from '../Models/Form';
import FormBody, { FormBodyImperativeHandle, FormBodyProps } from './Layouts/FormBody';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { ConventionForFormItemDisplay } from './ItemDisplays/FormItemDisplay';
import { FormResponse } from './useFormResponse';
import { FormItemRole } from '../graphqlTypes.generated';
import { ImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';

export type SinglePageFormPresenterProps = {
  form: CommonFormFieldsFragment;
  convention: ConventionForFormItemDisplay;
  response: FormResponse;
  currentUserViewerRole: FormItemRole;
  currentUserWriterRole: FormItemRole;
  responseValuesChanged: (newValues: Record<string, unknown>) => void;
  responseErrors?: FormBodyProps['errors'];
  imageAttachmentConfig?: ImageAttachmentConfig;
};

export default forwardRef<FormBodyImperativeHandle | undefined, SinglePageFormPresenterProps>(
  function SinglePageFormPresenter(
    {
      form,
      currentUserViewerRole,
      currentUserWriterRole,
      convention,
      response,
      responseValuesChanged,
      responseErrors,
      imageAttachmentConfig,
    },
    ref,
  ) {
    const formItems = useMemo(() => getSortedParsedFormItems(form), [form]);

    return (
      <>
        <FormBody
          convention={convention}
          currentUserViewerRole={currentUserViewerRole}
          currentUserWriterRole={currentUserWriterRole}
          ref={ref}
          formItems={formItems}
          formTypeIdentifier={form.form_type}
          errors={responseErrors}
          response={response}
          responseValuesChanged={responseValuesChanged}
          imageAttachmentConfig={imageAttachmentConfig}
        />
      </>
    );
  },
);
