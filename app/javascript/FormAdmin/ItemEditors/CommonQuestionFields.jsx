import React, { useContext } from 'react';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import { formItemPropertyUpdater } from '../FormItemUtils';
import useModal from '../../ModalDialogs/useModal';
import DefaultAnswerModal from './DefaultAnswerModal';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';
import FormItemIdentifierInput from './FormItemIdentifierInput';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';

function CommonQuestionFields() {
  const { formType } = useContext(FormEditorContext);
  const { formItem, setFormItem, standardItem } = useContext(FormItemEditorContext);
  const defaultAnswerModal = useModal();

  return (
    <div>
      <DefaultAnswerModal
        close={defaultAnswerModal.close}
        visible={defaultAnswerModal.visible}
      />
      {!standardItem && (
        <FormItemIdentifierInput
          value={formItem.identifier}
          onChange={(identifier) => setFormItem(
            (prevFormItem) => ({ ...prevFormItem, identifier }),
          )}
          formType={formType}
        />
      )}
      {(standardItem && standardItem.required)
        ? <div className="small mb-2">Response always required</div>
        : (
          <BooleanInput
            caption="Response required?"
            value={!!formItem.properties.required}
            onChange={formItemPropertyUpdater('required', setFormItem)}
          />
        )}
      <BootstrapFormInput
        label="Admin description"
        helpText="The name for this item in admin-facing reports.  If blank, the caption of the item will be used."
        value={formItem.admin_description}
        onTextChange={(value) => setFormItem((prevFormItem) => ({
          ...prevFormItem, admin_description: value,
        }))}
      />
      <BootstrapFormInput
        label="Public description"
        helpText="The name for this item in public-facing views.  If blank, the item will not appear in public-facing views."
        value={formItem.public_description}
        onTextChange={(value) => setFormItem((prevFormItem) => ({
          ...prevFormItem, public_description: value,
        }))}
      />
      <button
        type="button"
        className="btn btn-secondary"
        onClick={defaultAnswerModal.open}
      >
        {formItem.defaultAnswer ? 'Edit default answer' : 'Add default answer'}
      </button>
    </div>
  );
}

export default CommonQuestionFields;
