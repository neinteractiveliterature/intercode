import * as React from 'react';
import { BootstrapFormInput, usePropertySetters } from '@neinteractiveliterature/litform';
import { EditorView } from '@codemirror/view';
import { Trans } from 'react-i18next';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { CmsLayout } from '../../graphqlTypes.generated';

type CmsLayoutFields = Pick<CmsLayout, 'name' | 'admin_notes' | 'navbar_classes' | 'content'>;

export type CmsLayoutFormProps<T extends CmsLayoutFields> = {
  layout: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  readOnly?: boolean;
};

function CmsLayoutForm<T extends CmsLayoutFields>({
  layout,
  onChange,
  readOnly,
}: CmsLayoutFormProps<T>) {
  const [setName, setAdminNotes, setNavbarClasses, setContent] = usePropertySetters(
    onChange,
    'name',
    'admin_notes',
    'navbar_classes',
    'content',
  );

  const extensions = React.useMemo(() => [EditorView.editable.of(!readOnly)], [readOnly]);

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={layout.name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={layout.admin_notes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Navigation bar CSS classes"
        className="form-control font-monospace"
        value={layout.navbar_classes ?? ''}
        onTextChange={setNavbarClasses}
        helpText={
          <Trans
            i18nKey="cms.layoutForm.navbarClassesHelpText"
            values={{
              defaultClasses:
                'navbar-fixed-top navbar-expand-md mb-4 navbar-dark bg-intercode-blue',
            }}
          >
            Overrides the default CSS classes for the Bootstrap navigation bar
            {' (by default, '}
            <code>{'{{ defaultClasses }}'}</code>)
          </Trans>
        }
        readOnly={readOnly}
      />

      <div className="mb-3">
        <legend className="col-form-label">Content</legend>
        <LiquidInput value={layout.content ?? ''} onChange={setContent} extensions={extensions} />
      </div>
    </>
  );
}

export default CmsLayoutForm;
