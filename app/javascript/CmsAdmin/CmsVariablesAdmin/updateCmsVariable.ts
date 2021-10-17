import { ApolloCache, MutationResult } from '@apollo/client';
import { CmsVariablesQuery } from './queries';
import { CmsVariablesQueryData, SetCmsVariableMutationData } from './queries.generated';

export default function updateCmsVariable(
  cache: ApolloCache<unknown>,
  result: MutationResult<SetCmsVariableMutationData>,
): void {
  const data = cache.readQuery<CmsVariablesQueryData>({ query: CmsVariablesQuery });
  const cmsVariable = result.data?.setCmsVariable?.cms_variable;
  if (!data || !cmsVariable) {
    return;
  }
  let newVariables: CmsVariablesQueryData['cmsParent']['cmsVariables'] = [];
  if (data.cmsParent.cmsVariables.some((variable) => variable.key === cmsVariable.key)) {
    newVariables = data.cmsParent.cmsVariables.map((variable) => {
      if (variable.key === cmsVariable.key) {
        return cmsVariable;
      }

      return variable;
    });
  } else {
    newVariables = [...data.cmsParent.cmsVariables, cmsVariable];
  }

  cache.writeQuery<CmsVariablesQueryData>({
    query: CmsVariablesQuery,
    data: {
      ...data,
      cmsParent: {
        ...data.cmsParent,
        cmsVariables: newVariables,
      },
    },
  });
}
