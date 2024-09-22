import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { CmsVariablesQueryData } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { useActionData, useFetcher, useNavigation } from 'react-router-dom';

export type AddingVariable = Omit<CmsVariablesQueryData['cmsParent']['cmsVariables'][0], 'id'> & {
  generatedId: number;
};

export type AddVariableRowProps = {
  variable: AddingVariable;
  onChange: React.Dispatch<AddingVariable>;
  onCancel: (id: number) => void;
};

function AddVariableRow({ variable, onChange, onCancel }: AddVariableRowProps): JSX.Element {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const setError = useActionData();
  const navigation = useNavigation();
  const setInProgress = navigation.state !== 'idle';

  const save = () => {
    fetcher.submit({ value_json: variable.value_json }, { action: `./${variable.key}`, method: 'POST' });
    onCancel(variable.generatedId);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        save();
        break;

      default:
    }
  };

  return (
    <>
      <tr>
        <td>
          <input
            type="text"
            className="form-control font-monospace"
            value={variable.key}
            onChange={(event) => onChange({ ...variable, key: event.target.value })}
            aria-label="Variable name"
          />
        </td>
        <td>
          <input
            type="text"
            className="form-control font-monospace"
            value={variable.value_json}
            onChange={(event) => onChange({ ...variable, value_json: event.target.value })}
            onKeyDown={handleKeyDown}
            aria-label="Variable value (JSON format)"
          />
        </td>
        <td>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onCancel(variable.generatedId)}
              disabled={setInProgress}
              aria-label={t('buttons.cancel')}
            >
              <i className="bi-x" />
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={variable.key.trim() === '' || variable.value_json.trim() === '' || setInProgress}
              onClick={save}
              aria-label={t('buttons.save')}
            >
              <i className="bi-check" />
            </button>
          </div>
        </td>
      </tr>
      {setError ? (
        <tr>
          <td colSpan={3}>
            <ErrorDisplay graphQLError={setError as ApolloError} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default AddVariableRow;
