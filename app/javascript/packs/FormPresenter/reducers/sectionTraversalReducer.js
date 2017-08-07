import actions from '../actions';

function getCurrentSectionIndex(form, currentSectionId) {
  const currentEffectiveSectionId = currentSectionId || form.getSections().get(0).id;
  return form.getSectionIndex(currentEffectiveSectionId);
}

function updateSectionId(state, newSectionIndex) {
  return {
    ...state,
    currentSectionId: state.form.getSections().get(newSectionIndex).id,
  };
}

function addToSectionIndex(state, offset, limiter) {
  const currentSectionIndex = getCurrentSectionIndex(state.form, state.currentSectionId);
  const newSectionIndex = limiter(currentSectionIndex + offset);
  return updateSectionId(state, newSectionIndex);
}

export default function (state, action) {
  let maxSectionIndex;

  switch (action.type) {
    case actions.previousSection.toString():
      return addToSectionIndex(
        state,
        -1,
        newSectionIndex => Math.max(newSectionIndex, 0),
      );

    case actions.nextSection.toString():
      maxSectionIndex = state.form.getSections().size - 1;
      return addToSectionIndex(
        state,
        1,
        newSectionIndex => Math.min(newSectionIndex, maxSectionIndex),
      );

    default:
      return state;
  }
}
