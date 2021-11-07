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
