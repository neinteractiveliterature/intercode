import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

import useBucketKeyRemapping from '../../../app/javascript/EventAdmin/useBucketKeyRemapping';
import { BucketKeyMappingInput } from '../../../app/javascript/graphqlTypes.generated';

type Bucket = { key: string; id?: string; name?: string };

describe('useBucketKeyRemapping', () => {
  const buildEvent = (buckets: Bucket[]) => ({
    form_response_attrs: {
      registration_policy: { buckets, prevent_no_preference_signups: false },
    },
  });

  const buildInitialEvent = (buckets: Bucket[], bucketKeysWithPendingSignupsOrRequests: string[]) => ({
    ...buildEvent(buckets),
    bucket_keys_with_pending_signups_or_requests: bucketKeysWithPendingSignupsOrRequests,
  });

  const renderUseBucketKeyRemapping = (
    event: ReturnType<typeof buildEvent>,
    initialEvent: ReturnType<typeof buildInitialEvent>,
    onSubmit: (mappings?: BucketKeyMappingInput[]) => Promise<void>,
  ) => renderHook(() => useBucketKeyRemapping({ event, initialEvent, onSubmit }));

  it('submits immediately when no buckets were removed', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const initialEvent = buildInitialEvent([{ key: 'dogs', id: '1' }], []);
    const event = buildEvent([{ key: 'dogs' }]);
    const { result } = renderUseBucketKeyRemapping(event, initialEvent, onSubmit);

    await act(async () => {
      await result.current.updateEvent();
    });

    expect(onSubmit).toHaveBeenCalledWith();
    expect(result.current.remappingModalProps.visible).toBe(false);
  });

  it('submits immediately when a removed bucket has no pending signups or requests', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const initialEvent = buildInitialEvent([{ key: 'dogs', id: '1' }], []);
    const event = buildEvent([{ key: 'cats' }]);
    const { result } = renderUseBucketKeyRemapping(event, initialEvent, onSubmit);

    await act(async () => {
      await result.current.updateEvent();
    });

    expect(onSubmit).toHaveBeenCalledWith();
    expect(result.current.remappingModalProps.visible).toBe(false);
  });

  it('shows the remapping modal, carrying the removed bucket’s real id, when it has pending records', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const initialEvent = buildInitialEvent([{ key: 'dogs', id: '1', name: 'Dogs' }], ['dogs']);
    const event = buildEvent([{ key: 'cats' }]);
    const { result } = renderUseBucketKeyRemapping(event, initialEvent, onSubmit);

    act(() => {
      void result.current.updateEvent();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.remappingModalProps.visible).toBe(true);
    expect(result.current.remappingModalProps.removedBuckets).toEqual([{ key: 'dogs', id: '1', name: 'Dogs' }]);
  });

  it('submits with the confirmed mappings and hides the modal on confirm', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const initialEvent = buildInitialEvent([{ key: 'dogs', id: '1', name: 'Dogs' }], ['dogs']);
    const event = buildEvent([{ key: 'cats' }]);
    const { result } = renderUseBucketKeyRemapping(event, initialEvent, onSubmit);

    let updatePromise: Promise<void> | undefined;
    act(() => {
      updatePromise = result.current.updateEvent();
    });

    const mappings = [{ from_bucket_id: '1', to_key: 'cats' }];
    await act(async () => {
      await result.current.remappingModalProps.onConfirm(mappings);
    });
    await act(async () => {
      await updatePromise;
    });

    expect(onSubmit).toHaveBeenCalledWith(mappings);
    expect(result.current.remappingModalProps.visible).toBe(false);
  });

  it('does not submit, but still resolves the pending update, on cancel', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const initialEvent = buildInitialEvent([{ key: 'dogs', id: '1', name: 'Dogs' }], ['dogs']);
    const event = buildEvent([{ key: 'cats' }]);
    const { result } = renderUseBucketKeyRemapping(event, initialEvent, onSubmit);

    let updatePromise: Promise<void> | undefined;
    act(() => {
      updatePromise = result.current.updateEvent();
    });

    act(() => {
      result.current.remappingModalProps.onCancel();
    });
    await act(async () => {
      await updatePromise;
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.remappingModalProps.visible).toBe(false);
  });
});
