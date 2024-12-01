import { useCallback, useContext } from 'react';
import { BootstrapFormCheckbox, useMatchWidthStyle } from '@neinteractiveliterature/litform';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import RegistrationPolicyItemEditorPresetRow from './RegistrationPolicyItemEditorPresetRow';
import useArrayProperty from './useArrayProperty';
import usePropertyUpdater from './usePropertyUpdater';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { RegistrationPolicyFormItem, RegistrationPolicyPreset } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';
import { useSortableDndSensors } from '../../SortableUtils';
import RegistrationPolicyItemEditorPresetRowDragOverlay from './RegistrationPolicyItemEditorPresetRowDragOverlay';

export type RegistrationPolicyItemEditorProps = FormItemEditorProps<RegistrationPolicyFormItem>;
function RegistrationPolicyItemEditor({ formItem, setFormItem }: RegistrationPolicyItemEditorProps): JSX.Element {
  const { disabled } = useContext(FormItemEditorContext);

  const generateNewPreset: () => RegistrationPolicyPreset = useCallback(
    () => ({
      name: '',
      policy: {
        __typename: 'RegistrationPolicy',
        prevent_no_preference_signups: false,
        freeze_no_preference_buckets: false,
        buckets: [],
      },
    }),
    [],
  );

  const allowCustomChanged = usePropertyUpdater(setFormItem, 'allow_custom');

  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLTableElement>();
  const sensors = useSortableDndSensors();
  const [addPreset, presetChanged, deletePreset, draggingPreset, sortableHandlers] = useArrayProperty<
    WithGeneratedId<RegistrationPolicyPreset, string>,
    typeof formItem,
    'presets'
  >(formItem.properties.presets, 'presets', setFormItem, generateNewPreset);

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
      <table className="table" ref={matchWidthRef}>
        <thead>
          <tr>
            <th />
            <th>Policy preset</th>
            <th>Buckets</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <SortableContext
            items={formItem.properties.presets.map((preset) => preset.generatedId)}
            strategy={verticalListSortingStrategy}
          >
            {formItem.properties.presets.map((preset) => (
              <RegistrationPolicyItemEditorPresetRow
                key={preset.generatedId}
                preset={preset}
                deletePreset={deletePreset}
                onChange={presetChanged}
              />
            ))}
          </SortableContext>
          <tr>
            <td />
            <td colSpan={2}>
              <BootstrapFormCheckbox
                label="Allow users to create custom policies"
                checked={formItem.properties.allow_custom}
                onCheckedChange={allowCustomChanged}
                disabled={disabled}
                type="checkbox"
              />
            </td>
            <td />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td colSpan={4}>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addPreset} disabled={disabled}>
                <i className="bi-plus" /> Add policy preset
              </button>
            </td>
          </tr>
        </tfoot>
      </table>

      <DragOverlay>
        {draggingPreset && (
          <table className="table" style={matchWidthStyle}>
            <tbody>
              <RegistrationPolicyItemEditorPresetRowDragOverlay preset={draggingPreset} />
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default RegistrationPolicyItemEditor;
