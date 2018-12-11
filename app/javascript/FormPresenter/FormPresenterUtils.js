export function getCurrentSection(form, currentSectionId) {
  if (!currentSectionId) {
    return form.getSections().get(0);
  }
  return form.getSection(currentSectionId);
}

export function getIncompleteItems(items, response) {
  return items.filter(item => (
    !item.valueIsComplete(response[item.identifier])
  )).toList();
}

export function sectionIsComplete(form, section, response) {
  return getIncompleteItems(form.getItemsInSection(section.id), response).isEmpty();
}
