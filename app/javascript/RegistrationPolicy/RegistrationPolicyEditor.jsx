import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { bucketSortCompare, findPreset } from './RegistrationPolicyUtils';
import RegistrationBucketRow from './RegistrationBucketRow';
import {
  RegistrationPolicyPropType,
  addRegistrationPolicyBucket,
  getRegistrationPolicySlotsLimited,
  sumMinimumSlots,
  sumPreferredSlots,
  sumTotalSlots,
  updateRegistrationPolicyBucket,
  getRegistrationPolicyAnythingBucket,
  removeRegistrationPolicyBucket,
} from './RegistrationPolicy';
import RegistrationPolicyPreview from './RegistrationPolicyPreview';
import RegistrationPolicyPresetSelector from './RegistrationPolicyPresetSelector';
import PreventNoPreferenceSignupRow from './PreventNoPreferenceSignupRow';

function RegistrationPolicyEditor(props) {
  const {
    allowCustom, lockNameAndDescription, lockDeleteBuckets, lockLimitedBuckets,
    onChange, presets, validateComplete,
  } = props;
  const registrationPolicy = props.registrationPolicy || { buckets: [] };

  const [preset, setPreset] = useState(() => findPreset(registrationPolicy, presets));
  const [custom, setCustom] = useState(() => (
    presets
    && !preset
    && (registrationPolicy.buckets || []).length > 0
  ));

  const headerLabels = useMemo(
    () => [
      preset || lockNameAndDescription ? 'Bucket name' : 'Bucket name/description',
      'Limits',
      '',
    ],
    [lockNameAndDescription, preset],
  );

  const addBucketClicked = (event) => {
    event.preventDefault();

    const customBucketKeyNumbers = (registrationPolicy.buckets || [])
      .map((bucket) => bucket.key)
      .filter((key) => key.match(/^custom-\d+$/))
      .map((key) => Number.parseInt(key.replace('custom-', ''), 10));

    const maxBucketKeyNumber = (
      customBucketKeyNumbers.length > 0 ? Math.max(...customBucketKeyNumbers) : 0
    );

    const customBucketNumber = maxBucketKeyNumber + 1;

    onChange(addRegistrationPolicyBucket(
      registrationPolicy,
      `custom-${customBucketNumber}`,
      {
        name: `Custom ${customBucketNumber}`,
        anything: false,
        slots_limited: true,
        not_counted: false,
        expose_attendees: false,
      },
    ));
  };

  const addFlexBucketClicked = (event) => {
    event.preventDefault();
    onChange(addRegistrationPolicyBucket(
      registrationPolicy,
      'flex',
      {
        name: 'Flex',
        description: 'Characters that can be in any other limited bucket',
        slots_limited: true,
        anything: true,
      },
    ));
  };

  const bucketChanged = (key, newBucket) => {
    onChange(updateRegistrationPolicyBucket(
      registrationPolicy,
      key,
      newBucket,
    ));
  };

  const preventNoPreferenceSignupsChanged = (newValue) => {
    onChange({
      ...registrationPolicy,
      prevent_no_preference_signups: newValue === 'true',
    });
  };

  const deleteBucket = (key) => {
    onChange(removeRegistrationPolicyBucket(registrationPolicy, key));
  };

  const presetSelected = (event) => {
    if (!presets) {
      return;
    }

    const name = event.target.value;

    if (name === '_custom') {
      onChange({ buckets: registrationPolicy.buckets || [] });
      setPreset(undefined);
      setCustom(true);
    } else {
      const newPreset = presets.find((p) => p.name === name);
      setPreset(newPreset);
      setCustom(false);
      if (newPreset) {
        onChange(newPreset.policy);
      } else {
        onChange({ buckets: [], prevent_no_preference_signups: false });
      }
    }
  };

  const renderAddButtons = () => (preset
    ? null
    : (
      <ul className="list-inline">
        <li className="list-inline-item">
          <button type="button" className="btn btn-secondary" onClick={addBucketClicked}>
            Add regular bucket
          </button>
        </li>
        <li className="list-inline-item">
          <button
            type="button"
            className="btn btn-secondary anything-bucket"
            disabled={!!getRegistrationPolicyAnythingBucket(registrationPolicy)}
            onClick={addFlexBucketClicked}
          >
            Add flex bucket
          </button>
        </li>
      </ul>
    )
  );

  const renderBucketRow = (bucket) => {
    const bucketInPreset = (
      preset
      && !!preset.policy.buckets.find((presetBucket) => presetBucket.key === bucket.key)
    );

    const lockDelete = (
      bucketInPreset
      || (lockDeleteBuckets && lockDeleteBuckets.includes(bucket.key))
    );

    const lockLimited = (
      bucketInPreset
      || (lockLimitedBuckets && lockLimitedBuckets.includes(bucket.key))
    );

    return (
      <RegistrationBucketRow
        key={bucket.key}
        registrationBucket={bucket}
        onChange={bucketChanged}
        onDelete={deleteBucket}
        lockNameAndDescription={bucketInPreset || lockNameAndDescription}
        lockLimited={lockLimited}
        lockDelete={lockDelete}
        validateComplete={validateComplete}
      />
    );
  };

  const renderTotals = () => {
    if (!getRegistrationPolicySlotsLimited(registrationPolicy)) {
      return 'unlimited';
    }

    return (
      <>
        <span className="mr-2">
          {'Min: '}
          {sumMinimumSlots(registrationPolicy)}
        </span>
        <span className="mr-2">
          {'Pref: '}
          {sumPreferredSlots(registrationPolicy)}
        </span>
        <span className="mr-2">
          {'Max: '}
          {sumTotalSlots(registrationPolicy)}
        </span>
      </>
    );
  };

  const renderTable = () => {
    const bucketRows = (registrationPolicy.buckets || [])
      .sort(bucketSortCompare)
      .map((bucket) => renderBucketRow(bucket));

    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {headerLabels.map((label) => <th key={label}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {bucketRows}
          </tbody>
          <tfoot>
            <PreventNoPreferenceSignupRow
              columnCount={headerLabels.length}
              onChange={preventNoPreferenceSignupsChanged}
              preset={preset}
              registrationPolicy={registrationPolicy}
            />
            <tr>
              <td colSpan={headerLabels.length} className="text-right">
                <strong>Total capacity:</strong>
                {' '}
                {renderTotals()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderEditorBody = () => {
    if (presets) {
      return (
        <>
          <RegistrationPolicyPresetSelector
            presets={presets}
            preset={preset}
            custom={custom}
            allowCustom={allowCustom}
            presetSelected={presetSelected}
          />
          {(preset || custom) && (
            <>
              {renderTable()}
              {renderAddButtons()}
            </>
          )}
        </>
      );
    }

    return (
      <>
        {renderTable()}
        {renderAddButtons()}
      </>
    );
  };

  const renderPreviewContent = () => (
    <RegistrationPolicyPreview registrationPolicy={registrationPolicy} />
  );

  return (
    <div className="card">
      <div className="card-header">
        Registration policy
      </div>
      <div className="d-flex flex-column flex-lg-row">
        <div className="col-lg-8 p-3">
          {renderEditorBody()}
        </div>
        {renderPreviewContent()}
      </div>
    </div>
  );
}

RegistrationPolicyEditor.propTypes = {
  registrationPolicy: RegistrationPolicyPropType,
  onChange: PropTypes.func.isRequired,
  lockNameAndDescription: PropTypes.bool,
  lockLimitedBuckets: PropTypes.arrayOf(PropTypes.string.isRequired),
  lockDeleteBuckets: PropTypes.arrayOf(PropTypes.string.isRequired),
  presets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    policy: RegistrationPolicyPropType.isRequired,
  }).isRequired),
  allowCustom: PropTypes.bool,
  validateComplete: PropTypes.bool,
};

RegistrationPolicyEditor.defaultProps = {
  registrationPolicy: null,
  lockNameAndDescription: false,
  lockLimitedBuckets: null,
  lockDeleteBuckets: null,
  presets: null,
  allowCustom: false,
  validateComplete: false,
};

export default RegistrationPolicyEditor;
