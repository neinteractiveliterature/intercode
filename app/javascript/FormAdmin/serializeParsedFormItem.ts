import { FormEditorForm } from './FormEditorContexts';
import { FormEditorFormItemFieldsFragment } from './queries.generated';

export function serializeParsedFormItem(
  formItem: FormEditorForm['form_sections'][number]['form_items'][number],
): FormEditorFormItemFieldsFragment {
  const serialized: FormEditorFormItemFieldsFragment = {
    ...formItem,
    default_value: JSON.stringify(formItem.default_value ?? null),
    properties: JSON.stringify(formItem.properties),
    rendered_properties: JSON.stringify(formItem.rendered_properties),
  };

  return serialized;
}
