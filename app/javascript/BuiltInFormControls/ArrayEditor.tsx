import { useState, ReactNode } from 'react';
import * as React from 'react';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

export type RenderAddValueInputProps<T> = {
  value: T;
  onChange: React.Dispatch<T>;
  addValue: () => void;
};

export type ArrayEditorProps<T> = {
  array: T[];
  initialAddValue: T;
  valuesEqual: (a: T, b: T) => boolean;
  onChange: (value: T[]) => void;
  header: ReactNode;
  renderValue: (value: T) => ReactNode;
  getDeleteButtonLabel: (value: T) => string;
  getDeletePrompt: (value: T) => ReactNode;
  renderAddValueInput: (props: RenderAddValueInputProps<T>) => ReactNode;
  addValueLabel: ReactNode;
};

function ArrayEditor<T>({
  array,
  onChange,
  initialAddValue,
  valuesEqual,
  header,
  renderValue,
  getDeleteButtonLabel,
  getDeletePrompt,
  renderAddValueInput,
  addValueLabel,
}: ArrayEditorProps<T>): React.JSX.Element {
  const confirm = useConfirm();
  const [addingValue, setAddingValue] = useState(initialAddValue);
  const addValue = () => {
    onChange([...array, addingValue]);
    setAddingValue(initialAddValue);
  };
  const deleteValue = (value: T) => {
    onChange(array.filter((a) => !valuesEqual(a, value)));
  };

  return (
    <fieldset className="card mb-3">
      <div className="card-header">{header}</div>

      <ul className="list-group list-group-flush">
        {array.map((value, index) => (
          <li className="list-group-item" key={index}>
            <div className="d-flex">
              <div className="flex-grow-1">{renderValue(value)}</div>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                aria-label={getDeleteButtonLabel(value)}
                onClick={() =>
                  confirm({
                    prompt: getDeletePrompt(value),
                    action: () => deleteValue(value),
                    renderError: (e) => <ErrorDisplay graphQLError={e} />,
                  })
                }
              >
                <i className="bi-trash" />
              </button>
            </div>
          </li>
        ))}
        <li className="list-group-item">
          <div className="d-flex">
            <div className="flex-grow-1">
              {renderAddValueInput({
                value: addingValue,
                onChange: setAddingValue,
                addValue,
              })}
            </div>
            <button type="button" className="ms-2 btn btn-outline-primary" onClick={addValue}>
              {addValueLabel}
            </button>
          </div>
        </li>
      </ul>
    </fieldset>
  );
}

export type StringArrayEditorProps = Omit<
  ArrayEditorProps<string>,
  'renderAddValueInput' | 'initialAddValue' | 'valuesEqual'
> & {
  renderAddValueInput: (
    props: RenderAddValueInputProps<string> & {
      onKeyDown: React.KeyboardEventHandler;
    },
  ) => ReactNode;
};

export function StringArrayEditor({ renderAddValueInput, ...otherProps }: StringArrayEditorProps): React.JSX.Element {
  return (
    <ArrayEditor
      initialAddValue=""
      valuesEqual={(a, b) => a === b}
      renderAddValueInput={(props) =>
        renderAddValueInput({
          value: props.value,
          addValue: props.addValue,
          onKeyDown: (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              props.addValue();
            }
          },
          onChange: (addingValue: string) => {
            if (addingValue == null || addingValue.trim().length === 0) {
              return;
            }

            props.onChange(addingValue);
          },
        })
      }
      {...otherProps}
    />
  );
}

export default ArrayEditor;
