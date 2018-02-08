export function getCurrentSection(form, currentSectionId) {
  if (!currentSectionId) {
    return form.getSections().get(0);
  }
  return form.getSection(currentSectionId);
}

export function getIncompleteItems(form, section, response) {
  return form.getItemsInSection(section.id).filter(item => (
    !item.valueIsComplete(response[item.identifier])
  )).toList();
}

export function sectionIsComplete(form, section, response) {
  return getIncompleteItems(form, section, response).isEmpty();
}
