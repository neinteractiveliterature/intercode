import { Fragment } from 'react';
import uniq from 'lodash/uniq';
import { humanize } from 'inflected';

import ObjectDiffDisplay from './ObjectDiffDisplay';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { RegistrationPolicyFormItem } from '../../FormAdmin/FormItemUtils';

export type RegistrationPolicyItemChangeDisplayProps = {
  change: ParsedFormResponseChange<RegistrationPolicyFormItem>;
};

function RegistrationPolicyItemChangeDisplay({ change }: RegistrationPolicyItemChangeDisplayProps) {
  const { buckets: prevBuckets, ...otherPrev } = change.previous_value || {};
  const { buckets: newBuckets, ...otherNew } = change.new_value || {};
  const combinedBucketKeys = uniq([
    ...(prevBuckets || []).map((b) => b.key),
    ...(newBuckets || []).map((b) => b.key),
  ]).sort();

  return (
    <div className="border rounded p-1">
      <dl className="row mb-0">
        {combinedBucketKeys.map((key) => (
          <Fragment key={key}>
            <dt className="col-sm-3">
              {(change.new_value.buckets.find((b) => b.key === key) || {}).name}
            </dt>
            <dd className="col-sm-9">
              <ObjectDiffDisplay
                key={key}
                renderKey={(bucketKey) => humanize(bucketKey)}
                before={(prevBuckets || []).find((b) => b.key === key) || {}}
                after={(newBuckets || []).find((b) => b.key === key) || {}}
              />
            </dd>
          </Fragment>
        ))}
      </dl>
      <ObjectDiffDisplay before={otherPrev} after={otherNew} renderKey={(key) => humanize(key)} />
    </div>
  );
}

export default RegistrationPolicyItemChangeDisplay;
