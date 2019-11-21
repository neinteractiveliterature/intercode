import React, { useContext, useRef, useCallback } from 'react';
import { useMutation } from 'react-apollo-hooks';

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

  const createFormItem = useCallback(
    async (newFormItem) => {
      await createFormItemMutate({
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
    },
    [createFormItemMutate, currentSection.id, form.id],
  );

  const createStaticText = useCallback(
    () => createFormItem(buildNewFormItem('static_text')),
    [createFormItem],
  );

  return (
    <div className="row m-0">
      <nav className="col-3 bg-light p-2">
        <FormSectionNav />
      </nav>
      <div className="col px-0 border overflow-auto" style={{ height: '90vh' }}>
        <div className="d-flex flex-column align-items-stretch">
          <div className="bg-warning-light p-2 border-bottom border-warning sticky-top">
            <button className="btn btn-sm btn-secondary mr-2" type="button" onClick={newFormItemModal.open}>
              Add item
            </button>

            <button className="btn btn-sm btn-secondary" type="button" onClick={createStaticText}>
              <i className="fa fa-paragraph" />
              {' '}
              Add static text
            </button>
          </div>
          <div className="p-2">
            <FormSectionEditorContent />
          </div>
        </div>
        <div ref={sectionBottomRef} />
      </div>

      <NewFormItemModal
        visible={newFormItemModal.visible}
        close={newFormItemModal.close}
        createFormItem={createFormItem}
      />
    </div>
  );
}

export default FormSectionEditorLayout;
