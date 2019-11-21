import React, { useContext } from 'react';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import { formItemPropertyUpdater } from '../FormItemUtils';
import useModal from '../../ModalDialogs/useModal';
import DefaultAnswerModal from './DefaultAnswerModal';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';
import FormItemIdentifierInput from './FormItemIdentifierInput';

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
      {!(standardItem && standardItem.required) && (
        <BooleanInput
          caption="Response required?"
          value={!!formItem.properties.required}
          onChange={formItemPropertyUpdater('required', setFormItem)}
        />
      )}
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
