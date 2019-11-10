import React, { useMemo, useContext } from 'react';
import { pluralize } from 'inflected';
import classNames from 'classnames';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import { formItemPropertyUpdater } from '../FormItemUtils';
import useModal from '../../ModalDialogs/useModal';
import DefaultAnswerModal from './DefaultAnswerModal';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';

function CommonQuestionFields() {
  const { formType } = useContext(FormEditorContext);
  const { formItem, setFormItem, standardItem } = useContext(FormItemEditorContext);
  const standardItems = formType.standard_items || {};
  const defaultAnswerModal = useModal();

  const standardIdentifiers = useMemo(
    () => Object.entries(standardItems).map(([identifier]) => (identifier)),
    [standardItems],
  );

  const normalizedIdentifier = (formItem.identifier || '');
  const identifierIsReserved = standardIdentifiers.includes(normalizedIdentifier.toLowerCase());

  return (
    <div>
      <DefaultAnswerModal
        close={defaultAnswerModal.close}
        visible={defaultAnswerModal.visible}
      />
      {!standardItem && (
        <BootstrapFormInput
          label="Identifier"
          className={classNames('form-control', {
            'is-invalid': identifierIsReserved,
          })}
          invalidFeedback={
            identifierIsReserved && (
              <>
                <i className="fa fa-warning" />
                {' '}
                “
                {normalizedIdentifier}
                ”
                {' '}
                is a reserved identifier in
                {' '}
                {pluralize(formType.description)}
              </>
            )
          }
          value={formItem.identifier}
          onTextChange={(identifier) => setFormItem({ ...formItem, identifier })}
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
