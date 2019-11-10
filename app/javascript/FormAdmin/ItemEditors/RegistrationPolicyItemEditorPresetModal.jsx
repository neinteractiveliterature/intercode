import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import RegistrationPolicyEditor from '../../RegistrationPolicy/RegistrationPolicyEditor';

function RegistrationPolicyItemEditorPresetModal({
  initialPreset, onChange, visible, close,
}) {
  const [preset, setPreset] = useState(initialPreset);

  const policyChanged = (policy) => {
    setPreset((prevPreset) => ({ ...prevPreset, policy }));
  };

  const cancelClicked = () => {
    setPreset(initialPreset);
    close();
  };

  const saveClicked = () => {
    onChange(preset);
    close();
  };

  return (
    <Modal
      visible={visible}
      dialogClassName="modal-xl"
    >
      <div className="modal-header">
        Edit “
        {preset.name}
        ”
      </div>

      <div className="modal-body">
        <RegistrationPolicyEditor
          registrationPolicy={preset.policy}
          onChange={policyChanged}
          lockCounts
        />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={cancelClicked}>Cancel</button>
        <button className="btn btn-primary" type="button" onClick={saveClicked}>Save</button>
      </div>
    </Modal>
  );
}

RegistrationPolicyItemEditorPresetModal.propTypes = {
  initialPreset: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default RegistrationPolicyItemEditorPresetModal;
