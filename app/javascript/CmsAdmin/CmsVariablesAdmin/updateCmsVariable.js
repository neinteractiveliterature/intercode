import { CmsVariablesQuery } from './queries.gql';

export default function updateCmsVariable(
  cache,
  { data: { setCmsVariable: { cms_variable: cmsVariable } } },
) {
  const data = cache.readQuery({ query: CmsVariablesQuery });
  if (
    data.cmsVariables.some((variable) => variable.key === cmsVariable.key)
  ) {
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
