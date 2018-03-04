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
      formItems.push({
        ...item,
        id: formItemId,
        position: formItemId,
        form_section_id: formSectionId,
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
