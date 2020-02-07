import { formResponseValueIsCompleteIfRequired } from '../Models/FormItem';

export function getCurrentSection(form, currentSectionId) {
  if (!currentSectionId) {
    return form.getSections()[0];
  }
  return form.getSection(currentSectionId);
}

export function getIncompleteItems(items, response) {
  return items.filter((item) => (
    !formResponseValueIsCompleteIfRequired(item, response[item.identifier])
  ));
}

export function sectionIsComplete(form, section, response) {
  return getIncompleteItems(form.getItemsInSection(section.id), response).length === 0;
}
