import * as React from 'react';
import { BootstrapFormInput, usePropertySetters } from '@neinteractiveliterature/litform';
import { EditorView } from '@codemirror/view';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
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
}: CmsPartialFormProps<T>): React.JSX.Element {
  const [setName, setAdminNotes, setContent] = usePropertySetters(onChange, 'name', 'admin_notes', 'content');

  const extensions = React.useMemo(() => [EditorView.editable.of(!readOnly)], [readOnly]);

  return (
    <>
      <BootstrapFormInput
        label="Name"
        name="name"
        value={partial.name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        name="admin_notes"
        value={partial.admin_notes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="mb-3">
        <legend className="col-form-label">Content</legend>
        <LiquidInput value={partial.content ?? ''} onChange={setContent} extensions={extensions} />
        <input type="hidden" name="content" value={partial.content ?? ''} />
      </div>
    </>
  );
}

export default CmsPartialForm;
