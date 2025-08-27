import { useCallback } from 'react';
import classnames from 'classnames';
import { useConfirm } from '@neinteractiveliterature/litform';
import { useSortable } from '@dnd-kit/sortable';

import { MultipleChoiceFormItem } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';
import { getSortableStyle } from '../../SortableUtils';

type Choice = WithGeneratedId<NonNullable<MultipleChoiceFormItem['properties']>['choices'][0], string>;

function useChoicePropertyUpdater<PropertyName extends keyof Choice>(
  choiceChanged: (generatedId: string, choice: (prevChoice: Choice) => Choice) => void,
  generatedId: string,
  property: PropertyName,
) {
  return useCallback(
    (value: Choice[PropertyName]) => choiceChanged(generatedId, (prevChoice) => ({ ...prevChoice, [property]: value })),
    [choiceChanged, generatedId, property],
  );
}

export type MultipleChoiceOptionRowProps = {
  choice: Choice;
  choiceChanged: (generatedId: string, choice: (prevChoice: Choice) => Choice) => void;
  nonUnique: boolean;
  deleteChoice: (generatedId: string) => void;
};

function MultipleChoiceOptionRow({
  choice,
  choiceChanged,
  nonUnique,
  deleteChoice,
}: MultipleChoiceOptionRowProps): React.JSX.Element {
  const confirm = useConfirm();
  const { isDragging, setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: choice.generatedId.toString(),
  });
  const captionChanged = useChoicePropertyUpdater(choiceChanged, choice.generatedId, 'caption');
  const valueChanged = useChoicePropertyUpdater(choiceChanged, choice.generatedId, 'value');

  const style = getSortableStyle(transform, transition, isDragging);

  const missingValue = !choice.value || choice.value.trim() === '';
  const hasValidationError = nonUnique || missingValue;

  return (
    <tr style={style}>
      <td style={{ cursor: 'grab' }} {...attributes} {...listeners} ref={setNodeRef}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-grip-vertical" />
      </td>
      <td>
        <input
          aria-label="Option text"
          type="text"
          className="form-control"
          value={choice.caption || ''}
          onChange={(event) => captionChanged(event.target.value)}
        />
      </td>
      <td>
        <input
          aria-label="Option value"
          type="text"
          className={classnames('form-control', { 'is-invalid': hasValidationError })}
          value={choice.value || ''}
          onChange={(event) => valueChanged(event.target.value)}
        />
        {missingValue && <div className="invalid-feedback">Options must have an output value</div>}
        {nonUnique && <div className="invalid-feedback">Options should not have the same output value</div>}
      </td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() =>
            confirm({
              prompt: 'Are you sure you want to delete this option?',
              action: () => deleteChoice(choice.generatedId),
            })
          }
        >
          <span className="visually-hidden">Delete option</span>
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default MultipleChoiceOptionRow;
