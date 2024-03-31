import * as React from 'react';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import MoneyInput, { MoneyInputProps } from './MoneyInput';
import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';

export type InPlaceMoneyEditorProps = MoneyInputProps & {
  children?: React.ReactNode;
};

function InPlaceMoneyEditor({ value, children, ...props }: InPlaceMoneyEditorProps): JSX.Element {
  return (
    <InPlaceEditor<Money | undefined>
      value={value ?? undefined}
      renderInput={({ commitEditing, cancelEditing, inputProps }) => (
        <MoneyInput
          {...inputProps}
          inputGroupClassName="input-group input-group-sm"
          className="form-control form-control-sm"
          appendContent={
            <>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={cancelEditing}
                aria-label="Cancel editing"
                disabled={inputProps.committing}
              >
                <i className="bi-x" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={commitEditing}
                aria-label="Commit changes"
                disabled={inputProps.committing}
              >
                <i className="bi-check" />
              </button>
            </>
          }
        />
      )}
      {...props}
    >
      {children ?? formatMoney(value)}
    </InPlaceEditor>
  );
}

export default InPlaceMoneyEditor;
