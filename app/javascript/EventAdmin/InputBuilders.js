export const buildEventInput = (event, defaultFormResponseAttrs = {}) => {
  const { total_slots: totalSlots, ...formResponseAttrs } = event.form_response_attrs;

  return {
    event: {
      event_category_id: event.event_category.id,
      form_response_attrs_json: JSON.stringify({
        ...defaultFormResponseAttrs,
        ...formResponseAttrs,
      }),
    },
  };
};

export const buildRunInput = (run) => {
  if (!run.starts_at) {
    return null;
  }

  return {
    run: {
      starts_at: run.starts_at,
      schedule_note: run.schedule_note,
      title_suffix: run.title_suffix,
      room_ids: (run.rooms || []).map((room) => room.id),
    },
  };
};
