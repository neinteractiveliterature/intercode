import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useConfirm } from '../../ModalDialogs/Confirm';
import useSortable from '../../useSortable';
import useModal from '../../ModalDialogs/useModal';
import RegistrationPolicyItemEditorPresetModal from './RegistrationPolicyItemEditorPresetModal';

function usePresetPropertyUpdater(onChange, generatedId, property) {
  return useCallback(
    (value) => onChange(generatedId, (prevPreset) => ({
      ...prevPreset,
      [property]: value,
    })),
    [generatedId, onChange, property],
  );
}

function RegistrationPolicyItemEditorPresetRow({
  preset, index, movePreset, deletePreset, onChange,
}) {
  const confirm = useConfirm();
  const modal = useModal();
  const [rowRef, drag, { isDragging }] = useSortable(index, movePreset, 'choice');

  const presetChanged = useCallback(
    (newPreset) => onChange(preset.generatedId, () => newPreset),
    [onChange, preset.generatedId],
  );
  const presetNameChanged = usePresetPropertyUpdater(onChange, preset.generatedId, 'name');

  return (
    <tr ref={rowRef}>
      <td style={{ cursor: isDragging ? 'grabbing' : 'grab' }} ref={drag}>
        <span className="sr-only">Drag to reorder</span>
        <i className="fa fa-bars" />
      </td>
      <td>
        <input
          aria-label="Preset name"
          className="form-control"
          value={preset.name}
          onChange={(event) => presetNameChanged(event.target.value)}
        />
      </td>
      <td>
        {preset.policy.buckets.map((bucket) => bucket.name).join(', ') || 'None'}
      </td>
      <td>
        <RegistrationPolicyItemEditorPresetModal
          initialPreset={preset}
          visible={modal.visible}
          close={modal.close}
          onChange={presetChanged}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary mr-2"
          onClick={modal.open}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => confirm({
            prompt: 'Are you sure you want to delete this policy preset?',
            action: () => deletePreset(preset.generatedId),
          })}
        >
          <span className="sr-only">Delete preset</span>
          <i className="fa fa-trash-o" />
        </button>
      </td>
    </tr>
  );
}

RegistrationPolicyItemEditorPresetRow.propTypes = {
  preset: PropTypes.shape({
    generatedId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    policy: PropTypes.shape({
      buckets: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })).isRequired,
    }).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  movePreset: PropTypes.func.isRequired,
  deletePreset: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RegistrationPolicyItemEditorPresetRow;
