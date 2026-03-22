import { useState, useCallback } from 'react';
import BucketKeyRemappingModal from './BucketKeyRemappingModal';
import { BucketKeyMappingInput } from '../graphqlTypes.generated';

type Bucket = { key: string; name?: string | null };
type RegistrationPolicyLike = { buckets?: Bucket[] } | null;

function bucketsFromFormResponseAttrs(formResponseAttrs: { registration_policy?: unknown }): Bucket[] {
  return (formResponseAttrs.registration_policy as RegistrationPolicyLike)?.buckets ?? [];
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
  const [removedBucketsNeedingRemapping, setRemovedBucketsNeedingRemapping] = useState<Bucket[]>([]);

  const newPolicyBuckets = bucketsFromFormResponseAttrs(event.form_response_attrs);

  const updateEvent = useCallback(async () => {
    const currentBucketKeys = new Set(newPolicyBuckets.map((b) => b.key));
    const originalBuckets = bucketsFromFormResponseAttrs(initialEvent.form_response_attrs);
    const keysWithRecords = new Set(initialEvent.bucket_keys_with_pending_signups_or_requests);

    const removedBuckets = originalBuckets.filter((b) => !currentBucketKeys.has(b.key) && keysWithRecords.has(b.key));

    if (removedBuckets.length > 0) {
      setRemovedBucketsNeedingRemapping(removedBuckets);
      setRemappingModalVisible(true);
    } else {
      await onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, initialEvent, onSubmit]);

  const remappingModal = (
    <BucketKeyRemappingModal
      visible={remappingModalVisible}
      removedBuckets={removedBucketsNeedingRemapping}
      newPolicyBuckets={newPolicyBuckets}
      onConfirm={async (mappings) => {
        setRemappingModalVisible(false);
        await onSubmit(mappings);
      }}
      onCancel={() => setRemappingModalVisible(false)}
    />
  );

  return { updateEvent, remappingModal };
}
