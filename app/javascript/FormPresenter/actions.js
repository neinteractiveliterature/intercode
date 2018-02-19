import { createActions } from 'redux-actions';

const actions = {
  ...createActions({
    INTERACTED_WITH_ITEM: itemIdentifier => ({ itemIdentifier }),
    PREVIOUS_SECTION: form => ({ form }),
    NEXT_SECTION: form => ({ form }),
  }),
};

export default actions;
