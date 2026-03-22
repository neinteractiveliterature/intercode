import { FormResponse } from '../FormPresenter/useFormResponse';
import { BucketKeyMappingInput, EventInput, Run, RunInput } from '../graphqlTypes.generated';

export function buildEventInput(
  event: FormResponse & {
    event_category: { id: string };
    bucket_key_mappings?: BucketKeyMappingInput[] | null;
  },
  defaultFormResponseAttrs: Record<string, unknown> = {},
): { event: EventInput } {
  const { total_slots: totalSlots, ...formResponseAttrs } = event.form_response_attrs;

  return {
    event: {
      eventCategoryId: event.event_category.id,
      form_response_attrs_json: JSON.stringify({
        ...defaultFormResponseAttrs,
        ...formResponseAttrs,
      }),
      bucket_key_mappings: event.bucket_key_mappings,
    },
  };
}

export function buildRunInput(
  run: Pick<Run, 'starts_at' | 'schedule_note' | 'title_suffix'> & {
    rooms?: { id: string }[] | null;
  },
): { run: RunInput } | undefined {
  if (!run.starts_at) {
    return undefined;
  }

  return {
    run: {
      starts_at: run.starts_at,
      schedule_note: run.schedule_note,
      title_suffix: run.title_suffix,
      roomIds: run.rooms?.map((room) => room.id),
    },
  };
}
