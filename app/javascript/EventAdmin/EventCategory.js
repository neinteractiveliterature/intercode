import categoryData from '../../../config/event_categories.json';

export function getEventCategoryStyle(eventCategory, variant) {
  if (eventCategory[`${variant}_color`]) {
    return { backgroundColor: eventCategory[`${variant}_color`] };
  }

  return {};
}

class EventCategory {
  constructor({ key, ...props }) {
    this.key = key;
    this.name = props.name;
    this.singleRun = !!props.single_run;
    this.recurring = !!props.recurring;
  }

  isSingleRun = () => this.singleRun

  isRecurring = () => this.recurring

  isRegular = () => !this.isSingleRun() && !this.isRecurring()

  getClassName = () => `event-category-${this.key.replace(/_/g, '-')}`
}

EventCategory.allCategories = categoryData.map(category => new EventCategory(category));
EventCategory.singleRunCategories = EventCategory.allCategories.filter(category => (
  category.isSingleRun()
));
EventCategory.recurringCategories = EventCategory.allCategories.filter(category => (
  category.isRecurring()
));
EventCategory.regularCategories = EventCategory.allCategories.filter(category => (
  category.isRegular()
));

EventCategory.allCategoryKeys = EventCategory.allCategories.map(category => category.key);
EventCategory.singleRunCategoryKeys = EventCategory.singleRunCategories.map(category => (
  category.key
));
EventCategory.recurringCategoryKeys = EventCategory.recurringCategories.map(category => (
  category.key
));
EventCategory.regularCategoryKeys = EventCategory.regularCategories.map(category => category.key);
EventCategory.get = key => EventCategory.allCategories.find(category => category.key === key);

export default EventCategory;
