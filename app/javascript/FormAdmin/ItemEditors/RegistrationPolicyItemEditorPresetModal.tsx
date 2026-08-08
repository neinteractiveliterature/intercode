import { useState } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';

import RegistrationPolicyEditor from '../../RegistrationPolicy/RegistrationPolicyEditor';
import { withGeneratedBucketIds, withoutGeneratedBucketIds } from '../../RegistrationPolicy/RegistrationPolicy';
import { RegistrationPolicyPreset } from '../FormItemUtils';

export type RegistrationPolicyItemEditorPresetModalProps = {
  initialPreset: RegistrationPolicyPreset;
  onChange: (preset: RegistrationPolicyPreset) => void;
  visible: boolean;
  close: () => void;
};

function RegistrationPolicyItemEditorPresetModal({
  initialPreset,
  onChange,
  visible,
  close,
}: RegistrationPolicyItemEditorPresetModalProps): React.JSX.Element {
  // generatedId is the editor's own client-only bookkeeping mechanism and must never be
  // persisted as part of the preset, so it's assigned here (once, on open) and stripped again
  // in saveClicked.
  const [preset, setPreset] = useState(() => ({
    ...initialPreset,
    policy: withGeneratedBucketIds(initialPreset.policy),
  }));

  const policyChanged = (policy: typeof preset.policy) => {
    setPreset((prevPreset) => ({ ...prevPreset, policy }));
  };

  const cancelClicked = () => {
    setPreset({ ...initialPreset, policy: withGeneratedBucketIds(initialPreset.policy) });
    close();
  };

  const saveClicked = () => {
    onChange({ ...preset, policy: withoutGeneratedBucketIds(preset.policy) });
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
