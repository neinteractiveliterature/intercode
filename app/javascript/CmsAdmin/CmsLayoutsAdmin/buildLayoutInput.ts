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

export function buildLayoutInputFromFormData(formData: FormData): CmsLayoutInput {
  return {
    name: formData.get('name')?.toString(),
    content: formData.get('content')?.toString(),
    navbar_classes: formData.get('navbar_classes')?.toString(),
    admin_notes: formData.get('admin_notes')?.toString(),
  };
}
