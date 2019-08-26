import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import {
  bucketSortCompare,
  findPreset,
  isPreventNoPreferenceSignupsApplicable,
} from './RegistrationPolicyUtils';
import NoPreferenceHelpPopover from './NoPreferenceHelpPopover';
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

class RegistrationPolicyEditor extends React.Component {
  constructor(props) {
    super(props);
    enableUniqueIds(this);

    const initialPreset = findPreset(this.props.registrationPolicy, this.props.presets);
    const initiallyCustom = (
      this.props.presets
      && !initialPreset
      && ((this.props.registrationPolicy || {}).buckets || []).length > 0
    );

    this.state = {
      custom: initiallyCustom,
      preset: initialPreset,
    };
  }

  getHeaderLabels = () => [
    this.state.preset || this.props.lockNameAndDescription ? 'Bucket name' : 'Bucket name/description',
    'Limits',
    '',
  ]

  addBucket = (event) => {
    event.preventDefault();
    const customBucketKeyNumbers = this.props.registrationPolicy.buckets
      .map((bucket) => bucket.key)
      .filter((key) => key.match(/^custom-\d+$/))
      .map((key) => Number.parseInt(key.replace('custom-', ''), 10));
    const maxBucketKeyNumber = (
      customBucketKeyNumbers.length > 0 ? Math.max(...customBucketKeyNumbers) : 0
    );
    const customBucketNumber = maxBucketKeyNumber + 1;
    this.props.onChange(addRegistrationPolicyBucket(
      this.props.registrationPolicy,
      `custom-${customBucketNumber}`,
      {
        name: `Custom ${customBucketNumber}`,
        anything: false,
        slots_limited: true,
        not_counted: false,
        expose_attendees: false,
      },
    ));
  }

  addFlexBucket = (event) => {
    event.preventDefault();
    this.props.onChange(addRegistrationPolicyBucket(
      this.props.registrationPolicy,
      'flex',
      {
        name: 'Flex',
        description: 'Characters that can be in any other limited bucket',
        slots_limited: true,
        anything: true,
      },
    ));
  }

  bucketChanged = (key, newBucket) => {
    this.props.onChange(updateRegistrationPolicyBucket(
      this.props.registrationPolicy,
      key,
      newBucket,
    ));
  }

  preventNoPreferenceSignupsChanged = (newValue) => {
    this.props.onChange({
      ...this.props.registrationPolicy,
      prevent_no_preference_signups: newValue === 'true',
    });
  }

  deleteBucket = (key) => {
    this.props.onChange(removeRegistrationPolicyBucket(this.props.registrationPolicy, key));
  }

  presetSelected = (event) => {
    if (!this.props.presets) {
      return;
    }

    const name = event.target.value;

    if (name === '_custom') {
      this.setState({ preset: undefined, custom: true });
    } else {
      const preset = this.props.presets.find((p) => p.name === name);
      this.setState({ preset, custom: false });
      if (preset) {
        this.props.onChange(preset.policy);
      } else {
        this.props.onChange({ buckets: [], prevent_no_preference_signups: false });
      }
    }
  }

  renderHeaders = () => this.getHeaderLabels().map((label) => <th key={label}>{label}</th>)

  renderAddButtons = () => {
    if (this.state.preset) {
      return null;
    }

    const hasAnythingBucket = !!getRegistrationPolicyAnythingBucket(this.props.registrationPolicy);

    return (
      <ul className="list-inline">
        <li className="list-inline-item">
          <button type="button" className="btn btn-secondary" onClick={this.addBucket}>
            Add regular bucket
          </button>
        </li>
        <li className="list-inline-item">
          <button
            type="button"
            className="btn btn-secondary anything-bucket"
            disabled={hasAnythingBucket}
            onClick={this.addFlexBucket}
          >
            Add flex bucket
          </button>
        </li>
      </ul>
    );
  }

  renderBucketRow = (bucket) => {
    const bucketInPreset = (
      this.state.preset
      && !!this.state.preset.policy.buckets.find((presetBucket) => presetBucket.key === bucket.key)
    );

    const lockDelete = (
      bucketInPreset
      || (this.props.lockDeleteBuckets && this.props.lockDeleteBuckets.includes(bucket.key))
    );

    const lockLimited = (
      bucketInPreset
      || (this.props.lockLimitedBuckets && this.props.lockLimitedBuckets.includes(bucket.key))
    );

    return (
      <RegistrationBucketRow
        key={bucket.key}
        registrationBucket={bucket}
        onChange={this.bucketChanged}
        onDelete={this.deleteBucket}
        lockNameAndDescription={bucketInPreset || this.props.lockNameAndDescription}
        lockLimited={lockLimited}
        lockDelete={lockDelete}
      />
    );
  }

  renderTotals = () => {
    if (!getRegistrationPolicySlotsLimited(this.props.registrationPolicy)) {
      return 'unlimited';
    }

    return (
      <>
        <span className="mr-2">
          {'Min: '}
          {sumMinimumSlots(this.props.registrationPolicy)}
        </span>
        <span className="mr-2">
          {'Pref: '}
          {sumPreferredSlots(this.props.registrationPolicy)}
        </span>
        <span className="mr-2">
          {'Max: '}
          {sumTotalSlots(this.props.registrationPolicy)}
        </span>
      </>
    );
  }

  renderTable = () => {
    const bucketRows = this.props.registrationPolicy.buckets
      .sort(bucketSortCompare)
      .map((bucket) => this.renderBucketRow(bucket));

    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {this.renderHeaders()}
            </tr>
          </thead>
          <tbody>
            {bucketRows}
          </tbody>
          <tfoot>
            {this.renderPreventNoPreferenceSignupsRow()}
            <tr>
              <td colSpan={this.getHeaderLabels().length} className="text-right">
                <strong>Total capacity:</strong>
                {' '}
                {this.renderTotals()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  renderPresetSelector = () => {
    if (!this.props.presets) {
      return null;
    }

    if (this.props.presets.length === 1 && !this.props.allowCustom) {
      return null;
    }

    let selectorValue;
    if (this.state.preset) {
      selectorValue = this.state.preset.name;
    } else if (this.state.custom) {
      selectorValue = '_custom';
    }

    const presetOptions = this.props.presets.map((preset) => (
      <option value={preset.name} key={preset.name}>{preset.name}</option>
    ));
    if (this.props.allowCustom) {
      presetOptions.push(
        <option value="_custom" key="_custom">Custom registration policy (advanced)</option>,
      );
    }

    const selectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={selectId}>
          Select policy
          <select
            id={selectId}
            className="form-control"
            value={selectorValue || ''}
            onChange={this.presetSelected}
          >
            <option value="" disabled>Select one...</option>
            {presetOptions}
          </select>
        </label>
      </div>
    );
  }

  renderPreventNoPreferenceSignupsDescription = () => {
    if (!isPreventNoPreferenceSignupsApplicable(this.props.registrationPolicy)) {
      return (
        <span>
          &quot;No preference&quot; option is inapplicable
          {' '}
          <NoPreferenceHelpPopover registrationPolicy={this.props.registrationPolicy} />
        </span>
      );
    }

    if (this.props.registrationPolicy.prevent_no_preference_signups) {
      return (
        <span>
          &quot;No preference&quot; option will not be available
          {' '}
          <NoPreferenceHelpPopover registrationPolicy={this.props.registrationPolicy} />
        </span>
      );
    }

    return (
      <span>
        &quot;No preference&quot; option will be available
        {' '}
        <NoPreferenceHelpPopover registrationPolicy={this.props.registrationPolicy} />
      </span>
    );
  }

  renderPreventNoPreferenceSignupsRow = () => {
    if (
      this.state.preset
      || !isPreventNoPreferenceSignupsApplicable(this.props.registrationPolicy)
    ) {
      return (
        <tr>
          <td>No preference</td>
          <td colSpan={this.getHeaderLabels().length - 1}>
            {this.renderPreventNoPreferenceSignupsDescription()}
          </td>
        </tr>
      );
    }

    const boolValue = this.props.registrationPolicy.prevent_no_preference_signups;
    const choiceSetValue = (boolValue == null ? null : boolValue.toString());

    return (
      <tr>
        <td className="text-nowrap">
          No preference
          {' '}
          <NoPreferenceHelpPopover registrationPolicy={this.props.registrationPolicy} />
        </td>
        <td colSpan={this.getHeaderLabels().length - 1}>
          <ChoiceSet
            name="prevent_no_preference_signups"
            choices={[
              { label: 'Show "no preference" option', value: 'false' },
              { label: 'Don\'t show "no preference" option', value: 'true' },
            ]}
            choiceClassName="form-check-inline"
            value={choiceSetValue}
            onChange={this.preventNoPreferenceSignupsChanged}
          />
        </td>
      </tr>
    );
  }

  renderEditorBody = () => {
    if (this.props.presets) {
      if (this.state.preset || this.state.custom) {
        return (
          <>
            {this.renderPresetSelector()}
            {this.renderTable()}
            {this.renderAddButtons()}
          </>
        );
      }

      return this.renderPresetSelector();
    }

    return (
      <>
        {this.renderTable()}
        {this.renderAddButtons()}
      </>
    );
  }

  renderPreviewContent = () => (
    <RegistrationPolicyPreview
      registrationPolicy={this.props.registrationPolicy}
    />
  )

  render = () => (
    <div className="card">
      <div className="card-header">
        Registration policy
      </div>
      <div className="d-flex flex-column flex-lg-row">
        <div className="col-lg-8 p-3">
          {this.renderEditorBody()}
        </div>
        {this.renderPreviewContent()}
      </div>
    </div>
  )
}

RegistrationPolicyEditor.propTypes = {
  registrationPolicy: RegistrationPolicyPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  lockNameAndDescription: PropTypes.bool,
  lockLimitedBuckets: PropTypes.arrayOf(PropTypes.string.isRequired),
  lockDeleteBuckets: PropTypes.arrayOf(PropTypes.string.isRequired),
  presets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    policy: RegistrationPolicyPropType.isRequired,
  }).isRequired),
  allowCustom: PropTypes.bool,
};

RegistrationPolicyEditor.defaultProps = {
  lockNameAndDescription: false,
  lockLimitedBuckets: null,
  lockDeleteBuckets: null,
  presets: null,
  allowCustom: false,
};

export default RegistrationPolicyEditor;
