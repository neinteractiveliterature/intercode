import { CmsGraphqlQueryInput } from '../../graphqlTypes.generated';

export function buildCmsGraphqlQueryInputFromFormData(formData: FormData): CmsGraphqlQueryInput {
  return {
    identifier: formData.get('identifier')?.toString(),
    admin_notes: formData.get('admin_notes')?.toString(),
    query: formData.get('query')?.toString(),
  };
}
