import { useState, useCallback, useMemo, useRef } from 'react';
import { BucketKeyMappingInput } from '../graphqlTypes.generated';
import { BucketKeyRemappingModalProps } from './BucketKeyRemappingModal';

type DraftBucket = { key: string; name?: string | null };
// A bucket read from the event's already-persisted form response (as opposed to the current,
// possibly-unsaved draft) always has a real id, since RegistrationPolicyBucket#as_json includes
// it -- unlike a brand-new bucket in the draft, which has no id until the edit is saved.
type PersistedBucket = DraftBucket & { id: string };
type RegistrationPolicyLike<BucketType> = { buckets?: BucketType[]; prevent_no_preference_signups?: boolean } | null;

function bucketsFromFormResponseAttrs<BucketType>(formResponseAttrs: { registration_policy?: unknown }): BucketType[] {
  return (formResponseAttrs.registration_policy as RegistrationPolicyLike<BucketType>)?.buckets ?? [];
}

function preventNoPreferenceSignupsFromFormResponseAttrs(formResponseAttrs: {
  registration_policy?: unknown;
}): boolean {
  return (
    (formResponseAttrs.registration_policy as RegistrationPolicyLike<DraftBucket>)?.prevent_no_preference_signups ??
    false
  );
}

type UseBucketKeyRemappingOptions = {
  event: { form_response_attrs: { registration_policy?: unknown } };
  initialEvent: {
    form_response_attrs: { registration_policy?: unknown };
    bucket_keys_with_pending_signups_or_requests: string[];
  };
  onSubmit: (mappings?: BucketKeyMappingInput[]) => void | Promise<void>;
};

export default function useBucketKeyRemapping({ event, initialEvent, onSubmit }: UseBucketKeyRemappingOptions) {
  const [remappingModalVisible, setRemappingModalVisible] = useState(false);
  const [removedBucketsNeedingRemapping, setRemovedBucketsNeedingRemapping] = useState<PersistedBucket[]>([]);
  const pendingResolveRef = useRef<(() => void) | null>(null);
  const pendingRejectRef = useRef<((reason?: unknown) => void) | null>(null);

  const newPolicyBuckets = useMemo(() => bucketsFromFormResponseAttrs<DraftBucket>(event.form_response_attrs), [event]);
  const preventNoPreferenceSignups = useMemo(
    () => preventNoPreferenceSignupsFromFormResponseAttrs(event.form_response_attrs),
    [event],
  );

  const updateEvent = useCallback(async () => {
    const currentBucketKeys = new Set(newPolicyBuckets.map((b) => b.key));
    const originalBuckets = bucketsFromFormResponseAttrs<PersistedBucket>(initialEvent.form_response_attrs);
    const keysWithRecords = new Set(initialEvent.bucket_keys_with_pending_signups_or_requests);

    const removedBuckets = originalBuckets.filter((b) => !currentBucketKeys.has(b.key) && keysWithRecords.has(b.key));

    if (removedBuckets.length > 0) {
      setRemovedBucketsNeedingRemapping(removedBuckets);
      setRemappingModalVisible(true);
      return new Promise<void>((resolve, reject) => {
        pendingResolveRef.current = resolve;
        pendingRejectRef.current = reject;
      });
    } else {
      await onSubmit();
    }
  }, [newPolicyBuckets, initialEvent, onSubmit]);

  const remappingModalProps: BucketKeyRemappingModalProps = {
    visible: remappingModalVisible,
    removedBuckets: removedBucketsNeedingRemapping,
    newPolicyBuckets,
    preventNoPreferenceSignups,
    onConfirm: async (mappings) => {
      try {
        await onSubmit(mappings);
        setRemappingModalVisible(false);
        pendingResolveRef.current?.();
      } catch (e) {
        pendingRejectRef.current?.(e);
      } finally {
        pendingResolveRef.current = null;
        pendingRejectRef.current = null;
      }
    },
    onCancel: () => {
      setRemappingModalVisible(false);
      pendingResolveRef.current?.();
      pendingResolveRef.current = null;
      pendingRejectRef.current = null;
    },
  };

  return { updateEvent, remappingModalProps };
}
