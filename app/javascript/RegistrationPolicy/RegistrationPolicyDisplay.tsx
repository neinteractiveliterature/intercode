import { useMemo } from 'react';

import { bucketSortCompare, findPreset, isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import NoPreferenceHelpPopover from './NoPreferenceHelpPopover';
import {
  BucketForRegistrationPolicyUtils,
  RegistrationPolicyForRegistrationPolicyUtils,
  sumMinimumSlots,
  sumPreferredSlots,
  sumTotalSlots,
} from './RegistrationPolicy';
import RegistrationPolicyPreview from './RegistrationPolicyPreview';
import { RegistrationPolicyPreset } from '../FormAdmin/FormItemUtils';

function renderPresetName(preset: RegistrationPolicyPreset | undefined) {
  if (preset) {
    return preset.name;
  }

  return 'Custom registration policy';
}

function renderBucketOptions(bucket: BucketForRegistrationPolicyUtils, preset: RegistrationPolicyPreset | undefined) {
  if (preset) {
    return null;
  }

  const bucketOptions = [
    bucket.not_counted ? 'Not counted' : 'Counted',
    bucket.expose_attendees ? 'Display attendees' : null,
  ].filter((option) => option != null);

  return (
    <div className="ms-2">
      {bucketOptions.map((option, i) => (
        <span className="badge bg-secondary" key={option ?? i}>
          {option}
        </span>
      ))}
    </div>
  );
}

type RegistrationPolicyDisplayBucketRowProps = {
  bucket: BucketForRegistrationPolicyUtils;
  preset?: RegistrationPolicyPreset;
};

function RegistrationPolicyDisplayBucketRow({ bucket, preset }: RegistrationPolicyDisplayBucketRowProps) {
  return (
    <tr>
      <td>{bucket.name}</td>
      {preset ? null : <td>{bucket.description}</td>}
      <td>
        <div className="d-flex flex-column flex-lg-row">
          <div className="flex-grow-1">Min: {bucket.minimum_slots}</div>
          <div className="flex-grow-1">Pref: {bucket.preferred_slots}</div>
          <div className="flex-grow-1">Max: {bucket.total_slots}</div>
        </div>
      </td>
      <td>{renderBucketOptions(bucket, preset)}</td>
    </tr>
  );
}

export type RegistrationPolicyDisplayProps = {
  presets?: RegistrationPolicyPreset[];
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils;
};

function RegistrationPolicyDisplay({ presets, registrationPolicy }: RegistrationPolicyDisplayProps): React.JSX.Element {
  const preset = useMemo(() => findPreset(registrationPolicy, presets ?? []), [presets, registrationPolicy]);
  const isUnlimited = useMemo(
    () => !registrationPolicy.buckets.some((bucket) => bucket.slots_limited),
    [registrationPolicy.buckets],
  );

  const columnCount = preset ? 3 : 4;

  const renderPreventNoPreferenceSignupsRow = () => {
    if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
      return (
        <tr>
          <td colSpan={columnCount}>
            &quot;No preference&quot; option is inapplicable{' '}
            <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td colSpan={columnCount}>
          {registrationPolicy.prevent_no_preference_signups ? (
            <span>&quot;No preference&quot; option will not be available</span>
          ) : (
            <span>&quot;No preference&quot; option will be available</span>
          )}{' '}
          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </td>
      </tr>
    );
  };

  const renderTotals = () => {
    if (isUnlimited) {
      return 'unlimited';
    }

    return (
      <>
        <div className="flex-grow-1">Min: {sumMinimumSlots(registrationPolicy)}</div>
        <div className="flex-grow-1">Pref: {sumPreferredSlots(registrationPolicy)}</div>
        <div className="flex-grow-1">Max: {sumTotalSlots(registrationPolicy)}</div>
      </>
    );
  };

  const renderPolicyTable = () => (
    <table className="table">
      <thead>
        <tr>
          <th className="table-dark bg-black py-1 border-0" colSpan={columnCount}>
            {renderPresetName(preset)}
          </th>
        </tr>
        <tr>
          <th>Bucket name</th>
          {preset ? null : <th>Description</th>}
          <th>Limits</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {registrationPolicy.buckets.sort(bucketSortCompare).map((bucket) => (
          <RegistrationPolicyDisplayBucketRow bucket={bucket} preset={preset} key={bucket.key} />
        ))}
      </tbody>
      <tfoot>
        {renderPreventNoPreferenceSignupsRow()}
        <tr>
          <td colSpan={columnCount - 2} className="text-end">
            <strong className="me-2">Total capacity:</strong>
          </td>
          <td className="d-flex flex-column flex-lg-row">{renderTotals()}</td>
          <td />
        </tr>
      </tfoot>
    </table>
  );

  return (
    <div className="card">
      <div className="card-header">Registration policy</div>
      <div className="d-flex flex-column flex-lg-row">
        <div className="col-lg-8 p-3">{renderPolicyTable()}</div>
        <RegistrationPolicyPreview registrationPolicy={registrationPolicy} />
      </div>
    </div>
  );
}

export default RegistrationPolicyDisplay;
