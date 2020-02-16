import React, { useContext, useRef, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { CreateFormItem } from './mutations.gql';
import FormSectionNav from './FormSectionNav';
import FormSectionEditorContent from './FormSectionEditorContent';
import buildNewFormItem from './buildNewFormItem';
import { FormEditorContext } from './FormEditorContexts';
import { buildFormItemInput, mutationUpdaterForFormSection } from './FormItemUtils';
import useModal from '../ModalDialogs/useModal';
import NewFormItemModal from './NewFormItemModal';

function FormSectionEditorLayout() {
  const { currentSection, form } = useContext(FormEditorContext);
  const [createFormItemMutate] = useMutation(CreateFormItem);
  const sectionBottomRef = useRef();
  const newFormItemModal = useModal();
  const history = useHistory();

  const createFormItem = useCallback(
    async (newFormItem) => {
      const response = await createFormItemMutate({
        variables: {
          formSectionId: currentSection.id,
          formItem: buildFormItemInput(newFormItem),
        },
        update: mutationUpdaterForFormSection(
          form.id,
          currentSection.id,
          (formSection, { data: { createFormItem: { form_item: formItem } } }) => ({
            ...formSection, form_items: [...formSection.form_items, formItem],
          }),
        ),
      });

      if (sectionBottomRef.current) {
        sectionBottomRef.current.scrollIntoView();
      }

      return response;
    },
    [createFormItemMutate, currentSection, form.id],
  );

  const createStaticText = useCallback(
    async () => {
      const response = await createFormItem(buildNewFormItem('static_text'));
      history.push(`/admin_forms/${form.id}/edit/section/${currentSection.id}/item/${response.data.createFormItem.form_item.id}`);
    },
    [createFormItem, currentSection.id, form.id, history],
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

      <div className="form-section-editor-add-item-bar bg-warning-light p-2 border-top border-warning">
        <button className="btn btn-sm btn-secondary mr-2" type="button" onClick={newFormItemModal.open}>
          Add item
        </button>

        <button className="btn btn-sm btn-secondary" type="button" onClick={createStaticText}>
          <i className="fa fa-paragraph" />
          {' '}
          Add static text
        </button>

        <NewFormItemModal
          visible={newFormItemModal.visible}
          close={newFormItemModal.close}
          createFormItem={createFormItem}
        />
      </div>
    </>
  );
}

export default FormSectionEditorLayout;
