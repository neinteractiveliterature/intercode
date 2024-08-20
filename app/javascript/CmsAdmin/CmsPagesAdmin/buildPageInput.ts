import { PageInput } from '../../graphqlTypes.generated';
import type { PageFormFields } from './CmsPageForm';

export default function buildPageInput(page: PageFormFields): PageInput {
  return {
    name: page.name,
    admin_notes: page.admin_notes,
    slug: page.slug,
    skip_clickwrap_agreement: page.skip_clickwrap_agreement,
    hidden_from_search: page.hidden_from_search,
    cmsLayoutId: page.cms_layout?.id,
    content: page.content,
  };
}

export function buildPageInputFromFormData(formData: FormData): PageInput {
  return {
    name: formData.get('name')?.toString(),
    admin_notes: formData.get('admin_notes')?.toString(),
    slug: formData.get('slug')?.toString(),
    skip_clickwrap_agreement: formData.get('skip_clickwrap_agreement') === 'true',
    hidden_from_search: formData.get('hidden_from_search') === 'true',
    cmsLayoutId: formData.get('cms_layout_id')?.toString(),
    content: formData.get('content')?.toString(),
  };
}
