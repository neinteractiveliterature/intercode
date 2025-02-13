import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { CmsVariablesQueryData } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router-dom';
import { useEffect } from 'react';

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
  const setError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const setInProgress = fetcher.state !== 'idle';

  const save = () => {
    fetcher.submit({ value_json: variable.value_json }, { action: `./${variable.key}`, method: 'POST' });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !setError) {
      onCancel(variable.generatedId);
    }
  }, [fetcher.state, fetcher.data, onCancel, variable.generatedId, setError]);

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
            aria-label={t('cms.variables.keyLabel')}
          />
        </td>
        <td>
          <input
            type="text"
            className="form-control font-monospace"
            value={variable.value_json}
            onChange={(event) => onChange({ ...variable, value_json: event.target.value })}
            onKeyDown={handleKeyDown}
            aria-label={t('cms.variables.valueLabel')}
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
