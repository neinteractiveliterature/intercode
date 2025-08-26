import { useState } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';

import RegistrationPolicyEditor from '../../RegistrationPolicy/RegistrationPolicyEditor';
import { RegistrationPolicyPreset } from '../FormItemUtils';

export type RegistrationPolicyItemEditorPresetModalProps = {
  initialPreset: RegistrationPolicyPreset;
  onChange: React.Dispatch<React.SetStateAction<RegistrationPolicyPreset>>;
  visible: boolean;
  close: () => void;
};

function RegistrationPolicyItemEditorPresetModal({
  initialPreset,
  onChange,
  visible,
  close,
}: RegistrationPolicyItemEditorPresetModalProps): React.JSX.Element {
  const [preset, setPreset] = useState(initialPreset);

  const policyChanged = (policy: RegistrationPolicyPreset['policy']) => {
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
    <Modal visible={visible} dialogClassName="modal-xl">
      <div className="modal-header">Edit “{preset.name}”</div>

      <div className="modal-body">
        <RegistrationPolicyEditor registrationPolicy={preset.policy} onChange={policyChanged} lockCounts />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={cancelClicked}>
          Cancel
        </button>
        <button className="btn btn-primary" type="button" onClick={saveClicked}>
          Save
        </button>
      </div>
    </Modal>
  );
}

export default RegistrationPolicyItemEditorPresetModal;
