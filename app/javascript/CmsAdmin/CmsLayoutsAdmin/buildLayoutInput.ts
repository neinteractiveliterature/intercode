import { CmsLayout, CmsLayoutInput } from '../../graphqlTypes.generated';

export default function buildLayoutInput(
  layout: Pick<CmsLayout, 'name' | 'content' | 'navbar_classes' | 'admin_notes'>,
): CmsLayoutInput {
  return {
    name: layout.name,
    content: layout.content,
    navbar_classes: layout.navbar_classes,
    admin_notes: layout.admin_notes,
  };
}
