import { useContext, useId, useMemo } from 'react';
import {
  BootstrapFormInput,
  MultipleChoiceInput,
  BootstrapFormCheckbox,
  useMatchWidthStyle,
} from '@neinteractiveliterature/litform';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, MultipleChoiceFormItem } from '../FormItemUtils';
import MultipleChoiceOptionRow from './MultipleChoiceOptionRow';
import { FormItemEditorContext } from '../FormEditorContexts';
import useArrayProperty from './useArrayProperty';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { useSortableDndSensors } from '../../SortableUtils';
import MultipleChoiceOptionRowDragOverlay from './MultipleChoiceOptionRowDragOverlay';

export type MultipleChoiceEditorProps = FormItemEditorProps<MultipleChoiceFormItem>;
type FormItemType = MultipleChoiceEditorProps['formItem'];
type ChoiceType = FormItemType['properties']['choices'][0];
function MultipleChoiceEditor({ formItem, setFormItem }: MultipleChoiceEditorProps): React.JSX.Element {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useId();
  const generateNewChoice = () => ({ caption: '', value: '' });
  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLTableElement>();

  const sensors = useSortableDndSensors();
  const [addChoice, choiceChanged, deleteChoice, draggingChoice, sortableHandlers] = useArrayProperty<
    ChoiceType,
    FormItemType,
    'choices'
  >(formItem.properties.choices, 'choices', setFormItem, generateNewChoice);

  const nonUniqueDraggingChoice = useMemo(
    () => draggingChoice && formItem.properties.choices.filter((c) => c.value === draggingChoice.value).length > 1,
    [draggingChoice, formItem.properties.choices],
  );

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
      <div className="mb-3">
        <label htmlFor={captionInputId} className="form-label form-item-label">
          Caption
        </label>
        <LiquidInput
          disabled={disabled}
          lines={2}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', setFormItem)}
        />

        <MultipleChoiceInput
          caption="Style"
          choices={[
            { label: 'Single select, vertical layout', value: 'radio_vertical' },
            { label: 'Single select, horizontal layout', value: 'radio_horizontal' },
            { label: 'Multi-select, vertical layout', value: 'checkbox_vertical' },
            { label: 'Multi-select, horizontal layout', value: 'checkbox_horizontal' },
          ]}
          value={formItem.properties.style}
          onChange={formItemPropertyUpdater('style', setFormItem)}
          disabled={disabled}
        />

        <table className="table" ref={matchWidthRef}>
          <thead>
            <tr>
              <th />
              <th>Option text</th>
              <th>Output value</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={formItem.properties.choices.map((choice) => choice.generatedId)}
              strategy={verticalListSortingStrategy}
            >
              {formItem.properties.choices.map((choice) => (
                <MultipleChoiceOptionRow
                  key={choice.generatedId}
                  choice={choice}
                  deleteChoice={deleteChoice}
                  choiceChanged={choiceChanged}
                  nonUnique={formItem.properties.choices.filter((c) => c.value === choice.value).length > 1}
                />
              ))}
            </SortableContext>
            <tr>
              <td />
              <td>
                <BootstrapFormCheckbox
                  label="Include “other, please specify”"
                  checked={!!formItem.properties.other}
                  onCheckedChange={formItemPropertyUpdater('other', setFormItem)}
                  disabled={disabled}
                  type="checkbox"
                />
              </td>
              <td className="pb-0">
                {formItem.properties.other && (
                  <BootstrapFormInput
                    label="“Other” option text"
                    disabled={disabled || !formItem.properties.other}
                    value={formItem.properties.other_caption || ''}
                    onTextChange={formItemPropertyUpdater('other_caption', setFormItem)}
                  />
                )}
              </td>
              <td />
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td colSpan={3}>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addChoice}>
                  <i className="bi-plus" /> Add option
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <DragOverlay>
        {draggingChoice && (
          <table className="table" style={matchWidthStyle}>
            <tbody>
              <MultipleChoiceOptionRowDragOverlay
                choice={draggingChoice}
                nonUnique={nonUniqueDraggingChoice ?? false}
              />
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default MultipleChoiceEditor;
