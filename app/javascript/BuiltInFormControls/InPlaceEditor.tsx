import { useState, useRef, useLayoutEffect, useCallback, ReactNode, RefObject } from 'react';
import * as React from 'react';
import { useIsMounted } from '@neinteractiveliterature/litform';

export type InPlaceEditorInputProps<T> = {
  inputProps: {
    onChange: React.Dispatch<React.SetStateAction<T>>;
    value?: T;
    disabled?: boolean;
    committing?: boolean;
  };
  buttons: ReactNode;
  commitEditing: (event: React.SyntheticEvent) => Promise<void>;
  cancelEditing: React.EventHandler<any>;
};

const DefaultInPlaceEditorInput = React.forwardRef<
  HTMLInputElement,
  InPlaceEditorInputProps<string>
>(({ inputProps: { value, onChange, committing, disabled, ...inputProps }, buttons }, ref) => (
  <>
    <input
      type="text"
      className="form-control form-control-sm me-1"
      value={value || ''}
      {...inputProps}
      ref={ref}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      disabled={disabled || committing}
    />
    {buttons}
  </>
));

export type InPlaceEditorInputWrapperProps<T> = {
  initialValue: T;
  commit: ((value: T) => Promise<void>) | ((value: T) => void);
  cancel: React.EventHandler<any>;
  inputRef: RefObject<any>;
  renderInput: (props: InPlaceEditorInputProps<T>) => JSX.Element;
};

function InPlaceEditorInputWrapper<T>(props: InPlaceEditorInputWrapperProps<T>) {
  const { initialValue, commit, cancel, inputRef, renderInput } = props;
  const [value, setValue] = useState(initialValue);
  const [committing, setCommitting] = useState(false);
  const isMounted = useIsMounted();

  const commitEditing = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      await commit(value);
    } finally {
      if (isMounted.current) {
        setCommitting(false);
      }
    }
  };

  const keyDownInInput = (event: React.KeyboardEvent) => {
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
        className="btn btn-secondary btn-sm me-1"
        onClick={cancel}
        aria-label="Cancel editing"
        disabled={committing}
      >
        <i className="bi-x" />
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={commitEditing}
        aria-label="Commit changes"
        disabled={committing}
      >
        <i className="bi-check" />
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

  return renderInput(wrappedComponentProps);
}

function DefaultInPlaceEditorInputWrapper(
  props: Omit<InPlaceEditorInputWrapperProps<string>, 'renderInput'>,
) {
  return (
    <InPlaceEditorInputWrapper
      {...props}
      renderInput={(wrappedComponentProps: InPlaceEditorInputProps<string>) => (
        <DefaultInPlaceEditorInput {...wrappedComponentProps} />
      )}
    />
  );
}

export type InPlaceEditorProps<T> = {
  value: T;
  onChange: (value: T) => void | Promise<any>;
  children?: ReactNode;
  renderInput?: (props: InPlaceEditorInputProps<T>) => JSX.Element;
  className?: string;
};

function InPlaceEditor<T, InputType extends HTMLElement = HTMLElement>({
  children,
  className,
  onChange,
  renderInput,
  value,
}: InPlaceEditorProps<T>) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputType>();

  useLayoutEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const beginEditing = useCallback((event) => {
    event.preventDefault();
    setEditing(true);
  }, []);

  const cancelEditing = useCallback((event) => {
    event.preventDefault();
    setEditing(false);
  }, []);

  const commitEditing = useCallback(
    async (newValue: T) => {
      const onChangeReturn = onChange(newValue);
      if (onChangeReturn && onChangeReturn.then) {
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
        {renderInput ? (
          <InPlaceEditorInputWrapper
            commit={commitEditing}
            cancel={cancelEditing}
            initialValue={value}
            inputRef={inputRef}
            renderInput={renderInput}
          />
        ) : (
          <DefaultInPlaceEditorInputWrapper
            commit={commitEditing as unknown as (value: string) => void | Promise<any>}
            cancel={cancelEditing}
            initialValue={value as unknown as string}
            inputRef={inputRef}
          />
        )}
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div>{children || value}</div>
      <button
        type="button"
        className="btn btn-link btn-sm"
        onClick={beginEditing}
        aria-label="Edit"
      >
        <i className="bi-pencil-fill" />
      </button>
    </div>
  );
}

export default InPlaceEditor;
