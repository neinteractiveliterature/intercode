const schedulingUiPriority = ['regular', 'single_run', 'recurring'];

export default function sortEventCategories(eventCategories) {
  return [...eventCategories].sort((a, b) => {
    const aSchedulingUiPriority = schedulingUiPriority.indexOf(a.scheduling_ui);
    const bSchedulingUiPriority = schedulingUiPriority.indexOf(b.scheduling_ui);

    if (aSchedulingUiPriority !== bSchedulingUiPriority) {
      return aSchedulingUiPriority - bSchedulingUiPriority;
    }

    return a.name.localeCompare(b.name, { sensitivity: 'base' });
  });
}
