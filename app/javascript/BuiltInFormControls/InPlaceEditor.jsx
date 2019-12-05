import React, {
  useState, useRef, useLayoutEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';

function InPlaceEditor({
  children, className, onChange, renderInput, value,
}) {
  const [editing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState('');
  const inputRef = useRef();

  useLayoutEffect(
    () => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
      }
    },
    [editing],
  );

  const beginEditing = useCallback(
    (event) => {
      event.preventDefault();
      setEditing(true);
      setEditingValue(value);
    },
    [value],
  );

  const cancelEditing = useCallback(
    (event) => {
      event.preventDefault();
      setEditing(false);
      setEditingValue(undefined);
    },
    [],
  );

  const commitEditing = (event) => {
    event.preventDefault();
    onChange(editingValue);
    setEditing(false);
    setEditingValue(undefined);
  };

  const keyDownInInput = (event) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        cancelEditing(event);
        break;

      case 'Enter':
        event.preventDefault();
        commitEditing(event);
        break;

      default:
    }
  };

  const renderInputInternal = () => {
    const inputProps = {
      value: editingValue,
      onChange: setEditingValue,
      onKeyDown: keyDownInInput,
      ref: inputRef,
    };

    if (renderInput) {
      return renderInput(inputProps);
    }

    return (
      <input
        type="text"
        className="form-control form-control-sm mr-1"
        {...inputProps}
        onChange={(event) => { inputProps.onChange(event.target.value); }}
      />
    );
  };

  if (editing) {
    return (
      <div className={className || 'form-inline align-items-start'}>
        {renderInputInternal()}
        <button type="button" className="btn btn-secondary btn-sm mr-1" onClick={cancelEditing} aria-label="Cancel editing">
          <i className="fa fa-times" />
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={commitEditing} aria-label="Commit changes">
          <i className="fa fa-check" />
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div>{children || value}</div>
      <button type="button" className="btn btn-link btn-sm" onClick={beginEditing} aria-label="Edit">
        <i className="fa fa-pencil" />
      </button>
    </div>
  );
}

InPlaceEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  renderInput: PropTypes.func,
  className: PropTypes.string,
};

InPlaceEditor.defaultProps = {
  children: null,
  renderInput: null,
  className: null,
};

export default InPlaceEditor;
