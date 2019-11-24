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
    [createFormItemMutate, currentSection, form.id],
  );

  const createStaticText = useCallback(
    () => createFormItem(buildNewFormItem('static_text')),
    [createFormItem],
  );

  return (
    <>
      <nav className="form-section-editor-nav bg-light border-right p-2">
        <FormSectionNav />
      </nav>

      <div className="overflow-auto" style={{ gridRow: 'span 3' }}>
        <FormSectionEditorContent />

        <div ref={sectionBottomRef} />
      </div>

      <div className="bg-warning-light p-2 border-top border-warning">
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
