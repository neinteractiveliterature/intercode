import { useState } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator } from '@neinteractiveliterature/litform';
import { BucketKeyMappingInput } from '../graphqlTypes.generated';

type BucketOption = {
  key: string;
  name?: string | null;
};

export type BucketKeyRemappingModalProps = {
  visible: boolean;
  removedBuckets: BucketOption[];
  newPolicyBuckets: BucketOption[];
  onConfirm: (mappings: BucketKeyMappingInput[]) => Promise<void>;
  onCancel: () => void;
};

function BucketKeyRemappingModal({
  visible,
  removedBuckets,
  newPolicyBuckets,
  onConfirm,
  onCancel,
}: BucketKeyRemappingModalProps): React.JSX.Element {
  const { t } = useTranslation();
  const [mappings, setMappings] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This modal is mounted once, up front, with removedBuckets: [] -- a plain useState initializer
  // would only ever see that empty array, leaving every removed bucket's default "No preference"
  // selection un-seeded in state. Since handleConfirm below builds bucketKeyMappings from
  // Object.entries(mappings) rather than from removedBuckets, any bucket the admin never touches a
  // dropdown for (i.e. left at the already-selected default) would be silently missing from the
  // submitted mappings. Re-seed whenever the set of removed buckets changes, following React's
  // "adjusting state when a prop changes" pattern (setting state during render, rather than in an
  // effect, avoids an extra commit/re-render cycle).
  const [prevRemovedBuckets, setPrevRemovedBuckets] = useState(removedBuckets);
  if (prevRemovedBuckets !== removedBuckets) {
    setPrevRemovedBuckets(removedBuckets);
    setMappings(Object.fromEntries(removedBuckets.map((bucket) => [bucket.key, null])));
  }

  const setMapping = (fromKey: string, toKey: string | null) => {
    setMappings((prev) => ({ ...prev, [fromKey]: toKey }));
  };

  const handleConfirm = async () => {
    const bucketKeyMappings: BucketKeyMappingInput[] = Object.entries(mappings).map(([fromKey, toKey]) => ({
      from_key: fromKey,
      to_key: toKey ?? undefined,
    }));
    setIsSubmitting(true);
    try {
      await onConfirm(bucketKeyMappings);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">
        <h5 className="modal-title">{t('admin.events.bucketKeyRemapping.title')}</h5>
      </div>
      <div className="modal-body">
        <p>{t('admin.events.bucketKeyRemapping.description')}</p>
        <table className="table">
          <thead>
            <tr>
              <th>{t('admin.events.bucketKeyRemapping.removedBucketColumn')}</th>
              <th>{t('admin.events.bucketKeyRemapping.newBucketColumn')}</th>
            </tr>
          </thead>
          <tbody>
            {removedBuckets.map((bucket) => (
              <tr key={bucket.key}>
                <td>{bucket.name ?? bucket.key}</td>
                <td>
                  <select
                    className="form-select"
                    value={mappings[bucket.key] ?? ''}
                    onChange={(e) => setMapping(bucket.key, e.target.value || null)}
                    disabled={isSubmitting}
                  >
                    <option value="">{t('admin.events.bucketKeyRemapping.noPreferenceOption')}</option>
                    {newPolicyBuckets.map((newBucket) => (
                      <option key={newBucket.key} value={newBucket.key}>
                        {newBucket.name ?? newBucket.key}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          {t('buttons.cancel')}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingIndicator iconSet="bootstrap-icons" />
          ) : (
            t('admin.events.bucketKeyRemapping.confirmButton')
          )}
        </button>
      </div>
    </Modal>
  );
}

export default BucketKeyRemappingModal;
