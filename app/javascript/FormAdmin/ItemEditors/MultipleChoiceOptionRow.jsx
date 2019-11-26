import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useConfirm } from '../../ModalDialogs/Confirm';
import useSortable from '../../useSortable';

function useChoicePropertyUpdater(choiceChanged, generatedId, property) {
  return useCallback(
    (value) => choiceChanged(generatedId, (prevChoice) => ({ ...prevChoice, [property]: value })),
    [choiceChanged, generatedId, property],
  );
}

function MultipleChoiceOptionRow({
  choice, choiceChanged, index, nonUnique, deleteChoice, moveChoice,
}) {
  const confirm = useConfirm();
  const [rowRef, drag, { isDragging }] = useSortable(index, moveChoice, 'choice');
  const captionChanged = useChoicePropertyUpdater(choiceChanged, choice.generatedId, 'caption');
  const valueChanged = useChoicePropertyUpdater(choiceChanged, choice.generatedId, 'value');

  const missingValue = (!choice.value || choice.value.trim() === '');
  const hasValidationError = nonUnique || missingValue;

  return (
    <tr ref={rowRef} style={isDragging ? { opacity: 0.25 } : {}}>
      <td style={{ cursor: isDragging ? 'grabbing' : 'grab' }} ref={drag}>
        <span className="sr-only">Drag to reorder</span>
        <i className="fa fa-bars" />
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
        {missingValue && (
          <div className="invalid-feedback">
            Options must have an output value
          </div>
        )}
        {nonUnique && (
          <div className="invalid-feedback">
            Options should not have the same output value
          </div>
        )}
      </td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => confirm({
            prompt: 'Are you sure you want to delete this option?',
            action: () => deleteChoice(choice.generatedId),
          })}
        >
          <span className="sr-only">Delete option</span>
          <i className="fa fa-trash-o" />
        </button>
      </td>
    </tr>
  );
}

MultipleChoiceOptionRow.propTypes = {
  choice: PropTypes.shape({
    caption: PropTypes.string,
    value: PropTypes.string,
    generatedId: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  choiceChanged: PropTypes.func.isRequired,
  deleteChoice: PropTypes.func.isRequired,
  moveChoice: PropTypes.func.isRequired,
  nonUnique: PropTypes.bool,
};

MultipleChoiceOptionRow.defaultProps = {
  nonUnique: false,
};

export default MultipleChoiceOptionRow;
