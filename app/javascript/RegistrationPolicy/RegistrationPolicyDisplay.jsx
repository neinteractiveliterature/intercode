import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  bucketSortCompare,
  findPreset,
  isPreventNoPreferenceSignupsApplicable,
} from './RegistrationPolicyUtils';
import NoPreferenceHelpPopover from './NoPreferenceHelpPopover';
import {
  RegistrationPolicyPropType,
  sumMinimumSlots,
  sumPreferredSlots,
  sumTotalSlots,
} from './RegistrationPolicy';
import RegistrationPolicyPreview from './RegistrationPolicyPreview';

function renderPresetName(preset) {
  if (preset) {
    return preset.name;
  }

  return 'Custom registration policy';
}

function renderBucketOptions(bucket, preset) {
  if (preset) {
    return null;
  }

  const bucketOptions = [
    bucket.not_counted ? 'Not counted' : 'Counted',
    bucket.expose_atendees ? 'Expose attendees' : null,
  ].filter(option => option != null);

  return (
    <div className="ml-2">
      {bucketOptions.map(option => <span className="badge badge-secondary" key={option}>{option}</span>)}
    </div>
  );
}

function RegistrationPolicyDisplayBucketRow({ bucket, preset }) {
  return (
    <tr>
      <td>{bucket.name}</td>
      {
        preset
          ? null
          : <td>{bucket.description}</td>
      }
      <td>
        <div className="d-flex flex-column flex-lg-row">
          <div className="flex-grow-1">
            Min:
            {' '}
            {bucket.minimum_slots}
          </div>
          <div className="flex-grow-1">
            Pref:
            {' '}
            {bucket.preferred_slots}
          </div>
          <div className="flex-grow-1">
            Max:
            {' '}
            {bucket.total_slots}
          </div>
        </div>
      </td>
      <td>
        {renderBucketOptions(bucket, preset)}
      </td>
    </tr>
  );
}

RegistrationPolicyDisplayBucketRow.propTypes = {
  bucket: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    minimum_slots: PropTypes.number,
    preferred_slots: PropTypes.number,
    total_slots: PropTypes.number,
  }).isRequired,
  preset: PropTypes.shape({}),
};

RegistrationPolicyDisplayBucketRow.defaultProps = {
  preset: null,
};

function RegistrationPolicyDisplay({ presets, registrationPolicy }) {
  const preset = useMemo(
    () => findPreset(registrationPolicy, presets),
    [presets, registrationPolicy],
  );
  const isUnlimited = useMemo(
    () => !registrationPolicy.buckets.some(bucket => bucket.slots_limited),
    [registrationPolicy.buckets],
  );

  const columnCount = preset ? 3 : 4;

  const renderPreventNoPreferenceSignupsRow = () => {
    if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
      return (
        <tr>
          <td colSpan={columnCount}>
            &quot;No preference&quot; option is inapplicable
            {' '}
            <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td colSpan={columnCount}>
          {registrationPolicy.prevent_no_preference_signups
            ? <span>&quot;No preference&quot; option will not be available</span>
            : <span>&quot;No preference&quot; option will be available</span>
          }
          {' '}
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
      <React.Fragment>
        <div className="flex-grow-1">
          Min:
          {' '}
          {sumMinimumSlots(registrationPolicy)}
        </div>
        <div className="flex-grow-1">
          Pref:
          {' '}
          {sumPreferredSlots(registrationPolicy)}
        </div>
        <div className="flex-grow-1">
          Max:
          {' '}
          {sumTotalSlots(registrationPolicy)}
        </div>
      </React.Fragment>
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
          {
              preset
                ? null
                : <th>Description</th>
            }
          <th>Limits</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {registrationPolicy.buckets
          .sort(bucketSortCompare)
          .map(bucket => (
            <RegistrationPolicyDisplayBucketRow
              bucket={bucket}
              preset={preset}
              key={bucket.key}
            />
          ))}
      </tbody>
      <tfoot>
        {renderPreventNoPreferenceSignupsRow()}
        <tr>
          <td colSpan={columnCount - 2} className="text-right">
            <strong className="mr-2">Total capacity:</strong>
          </td>
          <td className="d-flex flex-column flex-lg-row">
            {renderTotals()}
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  );

  return (
    <div className="card">
      <div className="card-header">
        Registration policy
      </div>
      <div className="d-flex flex-column flex-lg-row">
        <div className="col-lg-8 p-3">
          {renderPolicyTable()}
        </div>
        <RegistrationPolicyPreview registrationPolicy={registrationPolicy} />
      </div>
    </div>
  );
}

RegistrationPolicyDisplay.propTypes = {
  presets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    policy: RegistrationPolicyPropType.isRequired,
  }).isRequired),
  registrationPolicy: RegistrationPolicyPropType.isRequired,
};

RegistrationPolicyDisplay.defaultProps = {
  presets: null,
};

export default RegistrationPolicyDisplay;
