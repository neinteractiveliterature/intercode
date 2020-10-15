import React from 'react';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { usePartialState, usePartialStateFactory } from '../../usePartialState';
import { CmsPartial } from '../../graphqlTypes.generated';

export type CmsPartialFormFields = Pick<CmsPartial, 'name' | 'admin_notes' | 'content'>;

export type CmsPartialFormProps<T extends CmsPartialFormFields> = {
  partial: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  readOnly?: boolean;
};

function CmsPartialForm<T extends CmsPartialFormFields>({
  partial,
  onChange,
  readOnly,
}: CmsPartialFormProps<T>) {
  const factory = usePartialStateFactory(partial, onChange);
  const [name, setName] = usePartialState(factory, 'name');
  const [adminNotes, setAdminNotes] = usePartialState(factory, 'admin_notes');
  const [content, setContent] = usePartialState(factory, 'content');

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={adminNotes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput value={content ?? ''} onChange={setContent} codeMirrorOptions={{ readOnly }} />
      </div>
    </>
  );
}

export default CmsPartialForm;
