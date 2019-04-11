import Form from '../../app/javascript/Models/Form';

export default function formFromExportJSON(exportJSON) {
  let formSectionId = 1;
  let formItemId = 1;
  const formSections = [];
  const formItems = [];

  exportJSON.sections.forEach((section) => {
    const { section_items: sectionItems, ...sectionProps } = section;

    formSections.push({
      ...sectionProps,
      id: formSectionId,
      position: formSectionId,
    });

    sectionItems.forEach((item) => {
      const {
        item_type: itemType,
        identifier,
        admin_description: adminDescription,
        public_description: publicDescription,
        default_value: defaultValue,
        ...properties
      } = item;

      formItems.push({
        id: formItemId,
        position: formItemId,
        form_section_id: formSectionId,
        item_type: itemType,
        identifier,
        admin_description: adminDescription,
        public_description: publicDescription,
        default_value: defaultValue,
        properties,
      });
      formItemId += 1;
    });

    formSectionId += 1;
  });

  return Form.fromApiResponse({
    form_sections: formSections,
    form_items: formItems,
  });
}
