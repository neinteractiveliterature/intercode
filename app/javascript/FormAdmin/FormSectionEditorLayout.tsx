import { useContext, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import FormSectionNav from './FormSectionNav';
import FormSectionEditorContent from './FormSectionEditorContent';
import buildNewFormItem from './buildNewFormItem';
import { FormEditorContext } from './FormEditorContexts';
import { buildFormItemInput, mutationUpdaterForFormSection } from './FormItemUtils';
import useModal from '../ModalDialogs/useModal';
import NewFormItemModal from './NewFormItemModal';
import { useCreateFormItemMutation } from './mutations.generated';
import { notEmpty } from '../ValueUtils';

function FormSectionEditorLayout() {
  const { currentSection, form, formType } = useContext(FormEditorContext);
  const [createFormItemMutate] = useCreateFormItemMutation();
  const sectionBottomRef = useRef<HTMLDivElement>(null);
  const newFormItemModal = useModal();
  const history = useHistory();

  const createFormItem = useCallback(
    async (newFormItem) => {
      const response = await createFormItemMutate({
        variables: {
          formSectionId: currentSection!.id,
          formItem: buildFormItemInput(newFormItem),
        },
        update: mutationUpdaterForFormSection(
          form.id,
          currentSection!.id,
          (formSection, result) => ({
            ...formSection,
            form_items: [
              ...formSection.form_items,
              ...[result.data?.createFormItem?.form_item].filter(notEmpty),
            ],
          }),
        ),
      });

      sectionBottomRef.current?.scrollIntoView();

      return response;
    },
    [createFormItemMutate, currentSection, form.id],
  );

  const createStaticText = useCallback(async () => {
    const response = await createFormItem(buildNewFormItem('static_text'));
    const formItemId = response.data?.createFormItem?.form_item.id;
    if (formItemId) {
      history.push(`/admin_forms/${form.id}/edit/section/${currentSection!.id}/item/${formItemId}`);
    }
  }, [createFormItem, currentSection, form.id, history]);

  return (
    <>
      <nav className="form-section-editor-nav bg-light border-right p-2">
        <FormSectionNav />
      </nav>

      <div className="form-section-editor-content overflow-auto">
        <FormSectionEditorContent />

        <div ref={sectionBottomRef} />
      </div>

      <div className="form-section-editor-add-item-bar bg-warning-light p-2 border-top border-warning">
        <button
          className="btn btn-sm btn-secondary me-2"
          type="button"
          onClick={newFormItemModal.open}
        >
          Add item
        </button>

        <button className="btn btn-sm btn-secondary" type="button" onClick={createStaticText}>
          <i className="fa fa-paragraph" /> Add static text
        </button>

        <NewFormItemModal
          visible={newFormItemModal.visible}
          close={newFormItemModal.close}
          createFormItem={createFormItem}
          formType={formType}
        />
      </div>
    </>
  );
}

export default FormSectionEditorLayout;
