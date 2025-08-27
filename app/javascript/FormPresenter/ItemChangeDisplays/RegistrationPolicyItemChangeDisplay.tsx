import { Fragment } from 'react';
import uniq from 'lodash/uniq';

import ObjectDiffDisplay from './ObjectDiffDisplay';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { FormItemValueType, RegistrationPolicyFormItem } from '../../FormAdmin/FormItemUtils';
import humanize from '../../humanize';

export type RegistrationPolicyItemChangeDisplayProps = {
  change: ParsedFormResponseChange<RegistrationPolicyFormItem>;
};

function isEmptyObject<T extends Record<string, unknown>>(value: T | Record<string, never>): value is T {
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return false;
  }

  return true;
}

function RegistrationPolicyItemChangeDisplay({ change }: RegistrationPolicyItemChangeDisplayProps): React.JSX.Element {
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
              {(change.new_value ?? change.previous_value)?.buckets.find((b) => b.key === key)?.name ?? key}
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
      <ObjectDiffDisplay<Omit<FormItemValueType<RegistrationPolicyFormItem>, 'buckets'>>
        before={isEmptyObject(otherPrev) ? undefined : otherPrev}
        after={isEmptyObject(otherNew) ? undefined : otherNew}
        renderKey={(key) => humanize(key)}
      />
    </div>
  );
}

export default RegistrationPolicyItemChangeDisplay;
