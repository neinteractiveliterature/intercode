import { useCallback } from 'react';
import * as React from 'react';
import { useModal, useConfirm } from '@neinteractiveliterature/litform';
import { useSortable } from '@dnd-kit/sortable';

import RegistrationPolicyItemEditorPresetModal from './RegistrationPolicyItemEditorPresetModal';
import { RegistrationPolicyPreset } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';
import { getSortableStyle } from '../../SortableUtils';

type PresetWithId = WithGeneratedId<RegistrationPolicyPreset, string>;

function usePresetPropertyUpdater<PropertyName extends keyof RegistrationPolicyPreset>(
  onChange: (generatedId: string, preset: React.SetStateAction<PresetWithId>) => void,
  generatedId: string,
  property: PropertyName,
) {
  return useCallback(
    (value: PresetWithId[PropertyName]) =>
      onChange(generatedId, (prevPreset) => ({
        ...prevPreset,
        [property]: value,
      })),
    [generatedId, onChange, property],
  );
}

export type RegistrationPolicyItemEditorPresetRowProps = {
  preset: PresetWithId;
  deletePreset: (generatedId: string) => void;
  onChange: (generatedId: string, preset: React.SetStateAction<PresetWithId>) => void;
};

function RegistrationPolicyItemEditorPresetRow({
  preset,
  deletePreset,
  onChange,
}: RegistrationPolicyItemEditorPresetRowProps): React.JSX.Element {
  const confirm = useConfirm();
  const modal = useModal();
  const { isDragging, setNodeRef, transform, transition, listeners, attributes } = useSortable({
    id: preset.generatedId,
  });

  const presetChanged = useCallback(
    (newPreset: PresetWithId) => onChange(preset.generatedId, () => newPreset),
    [onChange, preset.generatedId],
  );
  const presetNameChanged = usePresetPropertyUpdater(onChange, preset.generatedId, 'name');

  const style = getSortableStyle(transform, transition, isDragging);

  return (
    <tr style={style}>
      <td style={{ cursor: 'grab' }} {...listeners} {...attributes} ref={setNodeRef}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-grip-vertical" />
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
        <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={modal.open}>
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
