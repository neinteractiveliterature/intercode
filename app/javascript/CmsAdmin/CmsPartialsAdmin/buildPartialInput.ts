import { CmsPartialInput } from '../../graphqlTypes.generated';
import { CmsPartialFormFields } from './CmsPartialForm';

export default function buildPartialInput(partial: CmsPartialFormFields): CmsPartialInput {
  return {
    name: partial.name,
    content: partial.content,
    admin_notes: partial.admin_notes,
  };
}

export function buildPartialInputFromFormData(formData: FormData): CmsPartialInput {
  return {
    name: formData.get('name')?.toString(),
    admin_notes: formData.get('admin_notes')?.toString(),
    content: formData.get('content')?.toString(),
  };
}
