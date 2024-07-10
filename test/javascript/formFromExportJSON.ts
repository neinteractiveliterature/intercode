/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { FormItemRole } from '../../app/javascript/graphqlTypes.generated';
import {
  CommonFormFieldsFragment,
  CommonFormSectionFieldsFragment,
  CommonFormItemFieldsFragment,
} from '../../app/javascript/Models/commonFormFragments.generated';

export default function formFromExportJSON(exportJSON: any): CommonFormFieldsFragment {
  let formSectionId = 1;
  const formSections: CommonFormSectionFieldsFragment[] = [];

  exportJSON.sections.forEach((section: any) => {
    const { section_items: sectionItems, ...sectionProps } = section;

    const formItems: CommonFormItemFieldsFragment[] = [];
    let formItemId = 1;

    sectionItems.forEach((item: any) => {
      const {
        item_type: itemType,
        identifier,
        admin_description: adminDescription,
        public_description: publicDescription,
        default_value: defaultValue,
        ...properties
      } = item;

      formItems.push({
        __typename: 'FormItem',
        id: formItemId.toString(),
        position: formItemId,
        item_type: itemType,
        identifier,
        default_value: JSON.stringify(defaultValue ?? null),
        rendered_properties: JSON.stringify(properties),
        visibility: FormItemRole.Normal,
        writeability: FormItemRole.Normal,
      });
      formItemId += 1;
    });

    formSections.push({
      ...sectionProps,
      id: formSectionId.toString(),
      position: formSectionId,
      form_items: formItems,
    });

    formSectionId += 1;
  });

  return {
    __typename: 'Form',
    id: '1',
    title: exportJSON.title,
    form_type: exportJSON.form_type,
    form_sections: formSections,
  };
}
