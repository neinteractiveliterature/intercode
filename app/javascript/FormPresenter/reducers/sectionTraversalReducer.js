import actions from '../actions';

function getCurrentSectionIndex(form, currentSectionId) {
  const currentEffectiveSectionId = currentSectionId || form.getSections().get(0).id;
  return form.getSectionIndex(currentEffectiveSectionId);
}

function updateSectionId(state, form, newSectionIndex) {
  return {
    ...state,
    currentSectionId: form.getSections().get(newSectionIndex).id,
  };
}

function addToSectionIndex(state, form, offset, limiter) {
  const currentSectionIndex = getCurrentSectionIndex(form, state.currentSectionId);
  const newSectionIndex = limiter(currentSectionIndex + offset);
  return updateSectionId(state, form, newSectionIndex);
}

export default function (state, action) {
  let maxSectionIndex;

  switch (action.type) {
    case actions.previousSection.toString():
      return addToSectionIndex(
        state,
        action.payload.form,
        -1,
        newSectionIndex => Math.max(newSectionIndex, 0),
      );

    case actions.nextSection.toString():
      maxSectionIndex = action.payload.form.getSections().size - 1;
      return addToSectionIndex(
        state,
        action.payload.form,
        1,
        newSectionIndex => Math.min(newSectionIndex, maxSectionIndex),
      );

    default:
      return state;
  }
}
