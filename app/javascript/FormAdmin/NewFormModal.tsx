import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useFetcher } from 'react-router';
import { ApolloError } from '@apollo/client';
import { BootstrapFormInput, BootstrapFormSelect, ErrorDisplay } from '@neinteractiveliterature/litform';

import FormTypes from '../../../config/form_types.json';
import { FormType } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';

export type NewFormModalProps = {
  visible: boolean;
  close: () => void;
};

function NewFormModal({ visible, close }: NewFormModalProps): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [formType, setFormType] = useState<FormType>();
  const fetcher = useFetcher();
  const { t } = useTranslation();

  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  return (
    <Modal visible={visible}>
      <fetcher.Form method="POST">
        <div className="modal-header">{t('admin.forms.newForm.header')}</div>

        <div className="modal-body">
          <BootstrapFormInput
            label={t('admin.forms.newForm.titleLabel')}
            name="title"
            value={title}
            onTextChange={setTitle}
            disabled={inProgress}
          />

          <BootstrapFormSelect
            label={t('admin.forms.newForm.formTypeLabel')}
            name="form_type"
            value={formType}
            onValueChange={(newValue) => setFormType(newValue as FormType)}
            disabled={inProgress}
          >
            <option value="">{t('admin.forms.newForm.formTypePlaceholder')}</option>
            {Object.keys(FormTypes).map((value: keyof typeof FormTypes) => (
              <option value={value} key={value}>
                {t(`admin.forms.formTypes.${value}`)}
              </option>
            ))}
          </BootstrapFormSelect>

          <ErrorDisplay graphQLError={error as ApolloError} />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={close} disabled={inProgress}>
            {t('buttons.cancel')}
          </button>
          <button type="submit" disabled={!formType || !title || inProgress} className="btn btn-primary">
            {t('admin.forms.newForm.createButton')}
          </button>
        </div>
      </fetcher.Form>
    </Modal>
  );
}

export default NewFormModal;
