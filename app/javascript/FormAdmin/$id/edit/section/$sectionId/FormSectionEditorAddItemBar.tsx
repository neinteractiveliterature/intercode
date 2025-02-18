import { useCallback, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router-dom';
import { useModal } from '@neinteractiveliterature/litform';
import { FormEditorContext } from 'FormAdmin/FormEditorContexts';
import { CreateFormItemMutationData } from 'FormAdmin/mutations.generated';
import { buildFormItemInput, ParsedFormItem } from 'FormAdmin/FormItemUtils';
import buildNewFormItem from 'FormAdmin/buildNewFormItem';
import NewFormItemModal from './NewFormItemModal';
import styles from 'styles/form_editor.module.scss';

type FormSectionEditorAddItemBarProps = {
  sectionBottomRef: React.RefObject<HTMLElement>;
};

export default function FormSectionEditorAddItemBar({
  sectionBottomRef,
}: FormSectionEditorAddItemBarProps): JSX.Element {
  const { formType } = useContext(FormEditorContext);
  const { id, sectionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;

  useEffect(() => {
    if (fetcher.state === 'idle' && !error && fetcher.data) {
      const data = fetcher.data as CreateFormItemMutationData;
      if (data.createFormItem.form_item.item_type === 'static_text') {
        navigate(`/admin_forms/${id}/edit/section/${sectionId}/item/${data.createFormItem.form_item.id}`);
      } else {
        sectionBottomRef.current?.scrollIntoView();
      }
    }
  }, [fetcher.state, fetcher.data, error, navigate, sectionBottomRef, id, sectionId]);

  const createFormItem = useCallback(
    async (newFormItem: ParsedFormItem<Record<string, unknown>, unknown>) => {
      return fetcher.submit(buildFormItemInput(newFormItem), {
        encType: 'application/json',
        action: `/admin_forms/${id}/edit/section/${sectionId}/item`,
        method: 'POST',
      });
    },
    [fetcher, id, sectionId],
  );

  const createStaticText = useCallback(() => {
    createFormItem(buildNewFormItem('static_text'));
  }, [createFormItem]);

  const newFormItemModal = useModal();

  return (
    <div
      className={`form-section-editor-add-item-bar ${styles.formSectionEditorAddItemBar} bg-warning-light p-2 border-top border-warning`}
    >
      <button className="btn btn-sm btn-secondary me-2" type="button" onClick={newFormItemModal.open}>
        {t('admin.forms.addItem')}
      </button>

      <button className="btn btn-sm btn-secondary" type="button" onClick={createStaticText}>
        <i className="bi-paragraph" /> {t('admin.forms.addStaticText')}
      </button>

      <NewFormItemModal
        visible={newFormItemModal.visible}
        close={newFormItemModal.close}
        createFormItem={createFormItem}
        formType={formType}
      />
    </div>
  );
}
