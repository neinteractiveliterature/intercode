import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import FormItemInput from '../../FormPresenter/ItemInputs/FormItemInput';
import { FormItemEditorContext, FormEditorContext } from '../FormEditorContexts';

function DefaultAnswerModal({ close, visible }) {
  const { convention } = useContext(FormEditorContext);
  const { formItem, setFormItem, renderedFormItem } = useContext(FormItemEditorContext);
  const [defaultValue, setDefaultValue] = useState(formItem.default_value);
  const inputChanged = (identifier, newValue) => setDefaultValue(newValue);

  const setDefaultAnswer = () => {
    setFormItem({ ...formItem, default_value: defaultValue });
    close();
  };

  const clearDefaultAnswer = () => {
    setFormItem({ ...formItem, default_value: null });
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        Change default answer
      </div>
      <div className="modal-body">
        {renderedFormItem && (
          <FormItemInput
            convention={convention}
            formItem={renderedFormItem}
            onInteract={() => { }}
            value={defaultValue}
            onChange={inputChanged}
          />
        )}
      </div>
      <div className="modal-footer">
        <div className="flex-grow-1">
          <button type="button" className="btn btn-warning" onClick={clearDefaultAnswer}>
            Clear default answer
          </button>
        </div>
        <div>
          <button type="button" className="btn btn-secondary mr-2" onClick={close}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={setDefaultAnswer}>
            Set default answer
          </button>
        </div>
      </div>
    </Modal>
  );
}

DefaultAnswerModal.propTypes = {
  close: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default DefaultAnswerModal;
