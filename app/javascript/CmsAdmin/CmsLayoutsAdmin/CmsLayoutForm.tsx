import React from 'react';

import { Trans } from 'react-i18next';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { CmsLayout } from '../../graphqlTypes.generated';
import { usePartialState } from '../../useStatePropertyUpdater';

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
  const [name, setName] = usePartialState(layout, onChange, 'name');
  const [adminNotes, setAdminNotes] = usePartialState(layout, onChange, 'admin_notes');
  const [navbarClasses, setNavbarClasses] = usePartialState(layout, onChange, 'navbar_classes');
  const [content, setContent] = usePartialState(layout, onChange, 'content');

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

      <BootstrapFormInput
        label="Navigation bar CSS classes"
        className="form-control text-monospace"
        value={navbarClasses ?? ''}
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

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput value={content ?? ''} onChange={setContent} codeMirrorOptions={{ readOnly }} />
      </div>
    </>
  );
}

export default CmsLayoutForm;
