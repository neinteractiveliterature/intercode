import classnames from 'classnames';

import { MultipleChoiceFormItem } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';

type Choice = WithGeneratedId<NonNullable<MultipleChoiceFormItem['properties']>['choices'][0], string>;

export type MultipleChoiceOptionRowDragOverlayProps = {
  choice: Choice;
  nonUnique: boolean;
};

function MultipleChoiceOptionRowDragOverlay({
  choice,
  nonUnique,
}: MultipleChoiceOptionRowDragOverlayProps): React.JSX.Element {
  const missingValue = !choice.value || choice.value.trim() === '';
  const hasValidationError = nonUnique || missingValue;

  return (
    <tr>
      <td style={{ cursor: 'grabbing' }}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-grip-vertical" />
      </td>
      <td>
        <input
          aria-label="Option text"
          type="text"
          className="form-control"
          value={choice.caption || ''}
          onChange={() => {}}
        />
      </td>
      <td>
        <input
          aria-label="Option value"
          type="text"
          className={classnames('form-control', { 'is-invalid': hasValidationError })}
          value={choice.value || ''}
          onChange={() => {}}
        />
        {missingValue && <div className="invalid-feedback">Options must have an output value</div>}
        {nonUnique && <div className="invalid-feedback">Options should not have the same output value</div>}
      </td>
      <td>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {}}>
          <span className="visually-hidden">Delete option</span>
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default MultipleChoiceOptionRowDragOverlay;
