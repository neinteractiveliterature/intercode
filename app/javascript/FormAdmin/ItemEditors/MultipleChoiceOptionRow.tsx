import { useCallback } from 'react';
import classnames from 'classnames';
import { useConfirm } from '@neinteractiveliterature/litform';

import useSortable from '../../useSortable';
import { MultipleChoiceFormItem } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';

type Choice = WithGeneratedId<
  NonNullable<MultipleChoiceFormItem['properties']>['choices'][0],
  string
>;

function useChoicePropertyUpdater(
  choiceChanged: (generatedId: string, choice: (prevChoice: Choice) => Choice) => void,
  generatedId: string,
  property: keyof Choice,
) {
  return useCallback(
    (value) => choiceChanged(generatedId, (prevChoice) => ({ ...prevChoice, [property]: value })),
    [choiceChanged, generatedId, property],
  );
}

export type MultipleChoiceOptionRowProps = {
  choice: Choice;
  choiceChanged: (generatedId: string, choice: (prevChoice: Choice) => Choice) => void;
  index: number;
  nonUnique: boolean;
  deleteChoice: (generatedId: string) => void;
  moveChoice: (dragIndex: number, hoverIndex: number) => void;
};

function MultipleChoiceOptionRow({
  choice,
  choiceChanged,
  index,
  nonUnique,
  deleteChoice,
  moveChoice,
}: MultipleChoiceOptionRowProps) {
  const confirm = useConfirm();
  const [rowRef, drag, { isDragging }] = useSortable<HTMLTableRowElement>(
    index,
    moveChoice,
    'choice',
  );
  const captionChanged = useChoicePropertyUpdater(choiceChanged, choice.generatedId, 'caption');
  const valueChanged = useChoicePropertyUpdater(choiceChanged, choice.generatedId, 'value');

  const missingValue = !choice.value || choice.value.trim() === '';
  const hasValidationError = nonUnique || missingValue;

  return (
    <tr ref={rowRef} style={isDragging ? { opacity: 0.25 } : {}}>
      <td style={{ cursor: isDragging ? 'grabbing' : 'grab' }} ref={drag}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-list" />
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
        {nonUnique && (
          <div className="invalid-feedback">Options should not have the same output value</div>
        )}
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
