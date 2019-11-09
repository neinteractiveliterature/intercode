import React from 'react';
import PropTypes from 'prop-types';

import { useConfirm } from '../../ModalDialogs/Confirm';
import useSortable from '../../useSortable';
import classnames from 'classnames';

function MultipleChoiceOptionRow({
  caption, value, choiceChanged, index, nonUnique, deleteChoice, swapChoices,
}) {
  const confirm = useConfirm();
  const [rowRef, drag, { isDragging }] = useSortable(index, swapChoices, 'choice');

  const missingValue = (!value || value.trim() === '');
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
          value={caption || ''}
          onChange={(event) => choiceChanged(index, { caption: event.target.value })}
        />
      </td>
      <td>
        <input
          aria-label="Option value"
          type="text"
          className={classnames('form-control', { 'is-invalid': hasValidationError })}
          value={value || ''}
          onChange={(event) => choiceChanged(index, { value: event.target.value })}
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
            action: () => deleteChoice(index),
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
  caption: PropTypes.string,
  value: PropTypes.string,
  index: PropTypes.number.isRequired,
  choiceChanged: PropTypes.func.isRequired,
  deleteChoice: PropTypes.func.isRequired,
  swapChoices: PropTypes.func.isRequired,
  nonUnique: PropTypes.bool,
};

MultipleChoiceOptionRow.defaultProps = {
  caption: null,
  value: null,
  nonUnique: false,
};

export default MultipleChoiceOptionRow;
