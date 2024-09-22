import { RunInput } from '../graphqlTypes.generated';

export function buildRunInputFromFormData(formData: FormData): RunInput {
  return {
    roomIds: formData.getAll('room_ids').map((id) => id.toString()),
    schedule_note: formData.get('schedule_note')?.toString(),
    starts_at: formData.get('starts_at')?.toString(),
    title_suffix: formData.get('title_suffix')?.toString(),
  };
}
