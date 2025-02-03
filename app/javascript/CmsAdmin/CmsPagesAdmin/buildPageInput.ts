import { PageInput } from '../../graphqlTypes.generated';

export function buildPageInputFromFormData(formData: FormData): PageInput {
  return {
    name: formData.get('name')?.toString(),
    admin_notes: formData.get('admin_notes')?.toString(),
    slug: formData.get('slug')?.toString(),
    skip_clickwrap_agreement: formData.get('skip_clickwrap_agreement') === 'true',
    hidden_from_search: formData.get('hidden_from_search') === 'true',
    cmsLayoutId: formData.get('cms_layout_id')?.toString(),
    content: formData.get('content')?.toString(),
    metaDescription: formData.get('meta_description')?.toString(),
  };
}
