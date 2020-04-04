import React, {
  useState, useRef, useLayoutEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';

const DefaultInPlaceEditorInput = React.forwardRef((
  { inputProps: { value, onChange, ...inputProps }, buttons }, ref,
) => (
  <>
    <input
      type="text"
      className="form-control form-control-sm mr-1"
      value={value || ''}
      {...inputProps}
      ref={ref}
      onChange={(event) => { onChange(event.target.value); }}
    />
    {buttons}
  </>
));

DefaultInPlaceEditorInput.propTypes = {
  inputProps: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  buttons: PropTypes.node.isRequired,
};

function InPlaceEditorInputWrapper({
  initialValue, commit, cancel, inputRef, renderInput,
}) {
  const [value, setValue] = useState(initialValue);
  const [committing, setCommitting] = useState(false);

  const commitEditing = async (event) => {
    event.preventDefault();
    try {
      await commit(value);
    } finally {
      setCommitting(false);
    }
  };

  const keyDownInInput = (event) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        cancel(event);
        break;

      case 'Enter':
        event.preventDefault();
        commitEditing(event);
        break;

      default:
    }
  };

  const buttons = (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm mr-1"
        onClick={cancel}
        aria-label="Cancel editing"
        disabled={committing}
      >
        <i className="fa fa-times" />
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={commitEditing}
        aria-label="Commit changes"
        disabled={committing}
      >
        <i className="fa fa-check" />
      </button>
    </>
  );

  const wrappedComponentProps = {
    inputProps: {
      value,
      onChange: setValue,
      onKeyDown: keyDownInInput,
      ref: inputRef,
      disabled: committing,
      committing,
    },
    commitEditing,
    cancelEditing: cancel,
    buttons,
  };

  if (renderInput) {
    return renderInput(wrappedComponentProps);
  }

  return (
    <DefaultInPlaceEditorInput {...wrappedComponentProps} />
  );
}

InPlaceEditorInputWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  initialValue: PropTypes.any,
  commit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  inputRef: PropTypes.shape({}).isRequired,
  renderInput: PropTypes.func.isRequired,
};

InPlaceEditorInputWrapper.defaultProps = {
  initialValue: null,
};

function InPlaceEditor({
  children, className, onChange, renderInput, value,
}) {
  const [editing, setEditing] = useState(false);
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
    },
    [],
  );

  const cancelEditing = useCallback(
    (event) => {
      event.preventDefault();
      setEditing(false);
    },
    [],
  );

  const commitEditing = useCallback(
    async (newValue) => {
      const onChangeReturn = onChange(newValue);
      if (onChangeReturn?.then) {
        await onChangeReturn.then(() => {
          setEditing(false);
        });
      } else {
        setEditing(false);
      }
    },
    [onChange],
  );

  if (editing) {
    return (
      <div className={className || 'form-inline align-items-start'}>
        <InPlaceEditorInputWrapper
          commit={commitEditing}
          cancel={cancelEditing}
          initialValue={value}
          inputRef={inputRef}
          renderInput={renderInput}
        />
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
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any.isRequired,
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
