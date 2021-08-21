import { useCallback } from 'react';
import * as React from 'react';
import { useModal, useConfirm } from '@neinteractiveliterature/litform';

import useSortable from '../../useSortable';
import RegistrationPolicyItemEditorPresetModal from './RegistrationPolicyItemEditorPresetModal';
import { RegistrationPolicyPreset } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';

type PresetWithId = WithGeneratedId<RegistrationPolicyPreset, string>;

function usePresetPropertyUpdater(
  onChange: (generatedId: string, preset: React.SetStateAction<PresetWithId>) => void,
  generatedId: string,
  property: keyof RegistrationPolicyPreset,
) {
  return useCallback(
    (value) =>
      onChange(generatedId, (prevPreset) => ({
        ...prevPreset,
        [property]: value,
      })),
    [generatedId, onChange, property],
  );
}

export type RegistrationPolicyItemEditorPresetRowProps = {
  preset: PresetWithId;
  index: number;
  movePreset: (dragIndex: number, hoverIndex: number) => void;
  deletePreset: (generatedId: string) => void;
  onChange: (generatedId: string, preset: React.SetStateAction<PresetWithId>) => void;
};

function RegistrationPolicyItemEditorPresetRow({
  preset,
  index,
  movePreset,
  deletePreset,
  onChange,
}: RegistrationPolicyItemEditorPresetRowProps) {
  const confirm = useConfirm();
  const modal = useModal();
  const [rowRef, drag, { isDragging }] = useSortable<HTMLTableRowElement>(
    index,
    movePreset,
    'choice',
  );

  const presetChanged = useCallback(
    (newPreset) => onChange(preset.generatedId, () => newPreset),
    [onChange, preset.generatedId],
  );
  const presetNameChanged = usePresetPropertyUpdater(onChange, preset.generatedId, 'name');

  return (
    <tr ref={rowRef}>
      <td style={{ cursor: isDragging ? 'grabbing' : 'grab' }} ref={drag}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-list" />
      </td>
      <td>
        <input
          aria-label="Preset name"
          className="form-control"
          value={preset.name}
          onChange={(event) => presetNameChanged(event.target.value)}
        />
      </td>
      <td>{preset.policy.buckets.map((bucket) => bucket.name).join(', ') || 'None'}</td>
      <td>
        <RegistrationPolicyItemEditorPresetModal
          initialPreset={preset}
          visible={modal.visible}
          close={modal.close}
          onChange={presetChanged}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={modal.open}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() =>
            confirm({
              prompt: 'Are you sure you want to delete this policy preset?',
              action: () => deletePreset(preset.generatedId),
            })
          }
        >
          <span className="visually-hidden">Delete preset</span>
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default RegistrationPolicyItemEditorPresetRow;
