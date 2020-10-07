import { CmsPartialInput } from '../../graphqlTypes.generated';
import { CmsPartialFormFields } from './CmsPartialForm';

export default function buildPartialInput(partial: CmsPartialFormFields): CmsPartialInput {
  return {
    name: partial.name,
    content: partial.content,
    admin_notes: partial.admin_notes,
  };
}
