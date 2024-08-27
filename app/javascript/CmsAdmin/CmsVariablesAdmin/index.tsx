import { useState, useCallback } from 'react';
import { sortByLocaleString } from '@neinteractiveliterature/litform';

import AddVariableRow, { AddingVariable } from './AddVariableRow';
import ExistingVariableRow from './ExistingVariableRow';
import usePageTitle from '../../usePageTitle';
import { CmsVariablesQueryData, CmsVariablesQueryDocument } from './queries.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<CmsVariablesQueryData>({ query: CmsVariablesQueryDocument });
  return data;
};

function CmsVariablesAdmin(): JSX.Element {
  const data = useLoaderData() as CmsVariablesQueryData;
  const [addingVariables, setAddingVariables] = useState<AddingVariable[]>([]);

  const addVariable = useCallback(
    () =>
      setAddingVariables((prevAddingVariables) => [
        ...prevAddingVariables,
        {
          __typename: 'CmsVariable',
          key: '',
          value_json: '',
          generatedId: new Date().getTime(),
          current_ability_can_delete: true,
          current_ability_can_update: true,
        },
      ]),
    [],
  );

  const addVariableChanged = useCallback(
    (generatedId: number, value: AddingVariable) =>
      setAddingVariables((prevAddingVariables) =>
        prevAddingVariables.map((variable) => {
          if (variable.generatedId === generatedId) {
            return { ...variable, ...value };
          }

          return variable;
        }),
      ),
    [],
  );

  const removeAddVariable = useCallback(
    (generatedId: number) =>
      setAddingVariables((prevAddingVariables) =>
        prevAddingVariables.filter((variable) => variable.generatedId !== generatedId),
      ),
    [],
  );

  usePageTitle('CMS Variables');

  const cmsVariables = data.cmsParent.cmsVariables;

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="border-top-0">Name</th>
          <th className="border-top-0">Value (JSON format)</th>
          <th className="border-top-0" />
        </tr>
      </thead>
      <tbody>
        {sortByLocaleString(cmsVariables, (variable) => variable.key).map((variable) => (
          <ExistingVariableRow variable={variable} key={variable.key} />
        ))}
        {addingVariables.map((variable) => (
          <AddVariableRow
            variable={variable}
            key={variable.generatedId}
            onChange={(value) => addVariableChanged(variable.generatedId, value)}
            onCancel={(generatedId) => removeAddVariable(generatedId)}
          />
        ))}
        {cmsVariables.length + addingVariables.length === 0 ? (
          <tr>
            <td colSpan={3} className="font-italic">
              No variables defined.
            </td>
          </tr>
        ) : null}
      </tbody>
      {data.currentAbility.can_create_cms_variables && (
        <tfoot>
          <tr>
            <td colSpan={3}>
              <button type="button" className="btn btn-primary" onClick={addVariable}>
                Add variable
              </button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}

export const Component = CmsVariablesAdmin;
