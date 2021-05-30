import * as React from 'react';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { usePropertySetters } from '../../usePropertySetters';
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
  const [setName, setAdminNotes, setContent] = usePropertySetters(
    onChange,
    'name',
    'admin_notes',
    'content',
  );

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={partial.name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={partial.admin_notes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="mb-3">
        <legend className="col-form-label">Content</legend>
        <LiquidInput
          value={partial.content ?? ''}
          onChange={setContent}
          codeMirrorOptions={{ readOnly }}
        />
      </div>
    </>
  );
}

export default CmsPartialForm;
