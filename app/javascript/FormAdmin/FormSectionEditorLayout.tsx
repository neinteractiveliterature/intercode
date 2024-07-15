import React, { useContext, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal, notEmpty, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import FormSectionNav from './FormSectionNav';
import FormSectionEditorContent from './FormSectionEditorContent';
import buildNewFormItem from './buildNewFormItem';
import { FormEditorContext } from './FormEditorContexts';
import { buildFormItemInput, mutationUpdaterForFormSection, ParsedFormItem } from './FormItemUtils';
import NewFormItemModal from './NewFormItemModal';
import { useCreateFormItemMutation } from './mutations.generated';
import { FormEditorFormItemFieldsFragmentDoc, FormEditorQueryData } from './queries.generated';
import { useTranslation } from 'react-i18next';

type FormSectionEditorAddItemBarProps = {
  formSectionQueryData: FormEditorQueryData['convention']['form']['form_sections'][number];
  sectionBottomRef: React.RefObject<HTMLElement>;
};

function FormSectionEditorAddItemBar({
  formSectionQueryData,
  sectionBottomRef,
}: FormSectionEditorAddItemBarProps): JSX.Element {
  const { form, formType } = useContext(FormEditorContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [createFormItemMutate] = useCreateMutationWithReferenceArrayUpdater(
    useCreateFormItemMutation,
    formSectionQueryData,
    'form_items',
    (data) => data.createFormItem.form_item,
    FormEditorFormItemFieldsFragmentDoc,
    'FormEditorFormItemFelds',
  );

  const createFormItem = useCallback(
    async (newFormItem: ParsedFormItem<Record<string, unknown>, unknown>) => {
      const response = await createFormItemMutate({
        variables: {
          formSectionId: formSectionQueryData.id,
          formItem: buildFormItemInput(newFormItem),
        },
        update: mutationUpdaterForFormSection(form.id, formSectionQueryData.id, (formSection, result) => ({
          ...formSection,
          form_items: [...formSection.form_items, ...[result.data?.createFormItem?.form_item].filter(notEmpty)],
        })),
      });

      sectionBottomRef.current?.scrollIntoView();

      return response;
    },
    [createFormItemMutate, formSectionQueryData.id, form.id, sectionBottomRef],
  );

  const createStaticText = useCallback(async () => {
    const response = await createFormItem(buildNewFormItem('static_text'));
    const formItemId = response.data?.createFormItem?.form_item.id;
    if (formItemId) {
      navigate(`/admin_forms/${form.id}/edit/section/${formSectionQueryData.id}/item/${formItemId}`);
    }
  }, [createFormItem, formSectionQueryData.id, form.id, navigate]);

  const newFormItemModal = useModal();

  return (
    <div className="form-section-editor-add-item-bar bg-warning-light p-2 border-top border-warning">
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

function FormSectionEditorLayout(): JSX.Element {
  const { currentSection, convention } = useContext(FormEditorContext);
  const sectionBottomRef = useRef<HTMLDivElement>(null);

  const formSectionQueryData = useMemo(
    () =>
      currentSection ? convention.form.form_sections.find((section) => currentSection.id === section.id) : undefined,
    [currentSection, convention.form.form_sections],
  );

  return (
    <>
      <nav className="form-section-editor-nav bg-light border-right p-2">
        <FormSectionNav />
      </nav>

      <div className="form-section-editor-content overflow-auto">
        <FormSectionEditorContent />

        <div ref={sectionBottomRef} />
      </div>

      {formSectionQueryData && (
        <FormSectionEditorAddItemBar formSectionQueryData={formSectionQueryData} sectionBottomRef={sectionBottomRef} />
      )}
    </>
  );
}

export default FormSectionEditorLayout;
