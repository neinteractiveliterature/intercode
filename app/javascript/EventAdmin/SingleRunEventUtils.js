export const buildEventInput = (event, defaultFormResponseAttrs = {}) => ({
  event: {
    event_category_id: event.event_category.id,
    form_response_attrs_json: JSON.stringify({
      ...defaultFormResponseAttrs,
      ...event.form_response_attrs,
    }),
  },
});

export const buildRunInput = (run) => {
  if (!run.starts_at) {
    return null;
  }

  return {
    run: {
      starts_at: run.starts_at,
      schedule_note: run.schedule_note,
      title_suffix: run.title_suffix,
      room_ids: run.rooms.map(room => room.id),
    },
  };
};
