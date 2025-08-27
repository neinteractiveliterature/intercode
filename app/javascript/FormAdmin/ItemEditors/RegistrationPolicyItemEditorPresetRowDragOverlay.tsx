import { RegistrationPolicyPreset } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';

type PresetWithId = WithGeneratedId<RegistrationPolicyPreset, string>;

export type RegistrationPolicyItemEditorPresetRowDragOverlayProps = {
  preset: PresetWithId;
};

function RegistrationPolicyItemEditorPresetRowDragOverlay({
  preset,
}: RegistrationPolicyItemEditorPresetRowDragOverlayProps): React.JSX.Element {
  return (
    <tr>
      <td style={{ cursor: 'grabbing' }}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-grip-vertical" />
      </td>
      <td>
        <input aria-label="Preset name" className="form-control" value={preset.name} onChange={() => {}} />
      </td>
      <td>{preset.policy.buckets.map((bucket) => bucket.name).join(', ') || 'None'}</td>
      <td>
        <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => {}}>
          Edit
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {}}>
          <span className="visually-hidden">Delete preset</span>
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default RegistrationPolicyItemEditorPresetRowDragOverlay;
