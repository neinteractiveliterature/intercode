import { createActions } from 'redux-actions';

const actions = {
  ...createActions({
    INTERACTED_WITH_ITEM: itemIdentifier => ({ itemIdentifier }),
    PREVIOUS_SECTION: (form, currentSectionChanged) => ({ form, currentSectionChanged }),
    NEXT_SECTION: (form, currentSectionChanged) => ({ form, currentSectionChanged }),
  }),
};

export default actions;
