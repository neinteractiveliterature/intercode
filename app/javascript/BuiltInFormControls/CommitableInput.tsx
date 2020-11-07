import { useState, useCallback, useRef, ReactNode, InputHTMLAttributes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

type CommitableInputChangeHandler = React.Dispatch<string> | ((value: string) => Promise<void>);

export type CommitableInputProps = {
  value?: string;
  onChange: CommitableInputChangeHandler;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean;
  renderInput?: (
    props: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
      onChange: CommitableInputChangeHandler;
    },
  ) => ReactNode;
  placeholder?: string;
  label?: string;
};

function CommitableInput({
  value,
  onChange,
  onCancel,
  className,
  disabled,
  renderInput,
  placeholder,
  label,
}: CommitableInputProps) {
  const [editing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState<string | undefined>('');
  const [commitInProgress, setCommitInProgress] = useState(false);
  const inputRef = useRef<HTMLInputElement>();

  const beginEditing = useCallback(() => {
    setEditing(true);
    setEditingValue(value);
  }, [value]);

  const cancelEditing = useCallback(
    (event) => {
      event.preventDefault();
      setEditing(false);
      setEditingValue(undefined);
      if (inputRef.current) {
        inputRef.current.blur();
      }
      if (onCancel) {
        onCancel();
      }
    },
    [onCancel],
  );

  const commitEditing = async (event: React.KeyboardEvent | React.MouseEvent) => {
    event.preventDefault();
    setCommitInProgress(true);
    try {
      await onChange(editingValue ?? '');
      setEditing(false);
      setEditingValue(undefined);
      setCommitInProgress(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } catch (error) {
      setCommitInProgress(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      throw error;
    }
  };

  const blur = () => {
    if (editingValue === value) {
      setEditing(false);
      setEditingValue(undefined);
    }
  };

  const keyDownInInput = (event: React.KeyboardEvent) => {
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

  const inputProps = {
    className: classNames('form-control', className),
    onChange: setEditingValue,
    ref: inputRef,
    placeholder,
    'aria-label': label,
  };

  const renderInputInternal =
    renderInput ||
    (({ onChange: inputChange, ...props }) => (
      <input onChange={(event) => inputChange(event.target.value)} {...props} />
    ));

  if (editing) {
    return (
      <div className="input-group">
        {renderInputInternal({
          ...inputProps,
          onBlur: blur,
          value: editingValue || '',
          onKeyDown: keyDownInInput,
          disabled: commitInProgress,
        })}
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={cancelEditing}
            disabled={disabled || commitInProgress}
          >
            <i className="fa fa-times" />
            <span className="sr-only">Cancel changes</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={commitEditing}
            disabled={disabled || commitInProgress}
          >
            <i className="fa fa-check" />
            <span className="sr-only">Commit changes</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="input-group">
      {renderInputInternal({
        ...inputProps,
        value: value || '',
        onFocus: beginEditing,
        disabled,
      })}
      <div className="input-group-append">
        {value ? (
          <button
            type="button"
            className="btn btn-outline-danger"
            onMouseDown={() => {
              onChange('');
            }}
            disabled={disabled || !value}
          >
            <i className="fa fa-times-rectangle">
              <span className="sr-only">Clear</span>
            </i>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default CommitableInput;
