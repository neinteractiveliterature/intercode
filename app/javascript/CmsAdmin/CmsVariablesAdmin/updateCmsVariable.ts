import { ApolloCache, MutationResult } from '@apollo/client';
import { CmsVariablesQuery } from './queries';
import { CmsVariablesQueryData, SetCmsVariableMutationData } from './queries.generated';

export default function updateCmsVariable(
  cache: ApolloCache<any>,
  result: MutationResult<SetCmsVariableMutationData>,
) {
  const data = cache.readQuery<CmsVariablesQueryData>({ query: CmsVariablesQuery });
  const cmsVariable = result.data?.setCmsVariable?.cms_variable;
  if (!data || !cmsVariable) {
    return;
  }
  if (data.cmsVariables.some((variable) => variable.key === cmsVariable.key)) {
    data.cmsVariables = data.cmsVariables.map((variable) => {
      if (variable.key === cmsVariable.key) {
        return cmsVariable;
      }

      return variable;
    });
  } else {
    data.cmsVariables = [...data.cmsVariables, cmsVariable];
  }

  cache.writeQuery({ query: CmsVariablesQuery, data });
}
