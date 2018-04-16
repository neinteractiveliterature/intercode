import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { List } from 'immutable';
import ChoiceSet from './ChoiceSet';
import HelpPopover from '../UIComponents/HelpPopover';
import RegistrationBucketRow from './RegistrationBucketRow';
import RegistrationPolicy from '../Models/RegistrationPolicy';

const NO_PREFERENCE_HELP_TEXT = 'For events that have more than one registration bucket with ' +
'limited slots, we can display a "no preference" option for signups. Users who sign up ' +
' using that option will be placed in whatever limited-slot bucket has availability, and moved ' +
'between buckets to make space as necessary.';

function bucketSortCompare(a, b) {
  if (a.get('anything') && !b.get('anything')) {
    return 1;
  } else if (b.get('anything') && !a.get('anything')) {
    return -1;
  }

  return a.get('name').localeCompare(b.get('name'), { sensitivity: 'base' });
}

class RegistrationPolicyEditor extends React.Component {
  static propTypes = {
    registrationPolicy: RegistrationPolicy.propType.isRequired,
    onChange: PropTypes.func.isRequired,
    lockNameAndDescription: PropTypes.bool,
    lockLimitedBuckets: PropTypes.arrayOf(PropTypes.string.isRequired),
    lockDeleteBuckets: PropTypes.arrayOf(PropTypes.string.isRequired),
    presets: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      policy: RegistrationPolicy.apiRepresentationPropType.isRequired,
    }).isRequired),
  }

  static defaultProps = {
    lockNameAndDescription: false,
    lockLimitedBuckets: null,
    lockDeleteBuckets: null,
    presets: null,
  }

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    let initialPreset;
    let initiallyCustom = false;
    if (Array.isArray(this.props.presets)) {
      initialPreset = this.props.presets.find(preset => (
        preset.policy.buckets.every(bucket => (
          typeof bucket.key === 'string' &&
            this.props.registrationPolicy.getBucket(bucket.key)
        )) &&
        this.props.registrationPolicy.buckets.every(bucket =>
          preset.policy.buckets.find(presetBucket => presetBucket.key === bucket.key &&
            presetBucket.slots_limited === bucket.slotsLimited &&
            presetBucket.not_counted === bucket.notCounted)) &&
        (
          this.props.registrationPolicy.getPreventNoPreferenceSignups() ===
          Boolean(preset.policy.prevent_no_preference_signups)
        )
      ));

      if (!initialPreset && (this.props.registrationPolicy.buckets || new List()).size > 0) {
        initiallyCustom = true;
      }
    }

    this.state = {
      custom: initiallyCustom,
      preset: initialPreset,
    };
  }

  getHeaderLabels = () => [
    'Name',
    ...(this.state.preset || this.props.lockNameAndDescription ? [] : ['Description']),
    'Limits',
    '',
  ]

  addBucket = (event) => {
    event.preventDefault();
    const customBucketKeyNumbers = this.props.registrationPolicy.buckets
      .map(bucket => bucket.get('key'))
      .filter(key => key.match(/^custom-\d+$/))
      .map(key => Number.parseInt(key.replace('custom-', ''), 10))
      .toJS();
    const maxBucketKeyNumber = (
      customBucketKeyNumbers.length > 0 ? Math.max(...customBucketKeyNumbers) : 0
    );
    const customBucketNumber = maxBucketKeyNumber + 1;
    this.props.onChange(this.props.registrationPolicy.addBucket(
      `custom-${customBucketNumber}`,
      { name: `Custom ${customBucketNumber}`, slots_limited: true },
    ));
  }

  addFlexBucket = (event) => {
    event.preventDefault();
    this.props.onChange(this.props.registrationPolicy.addBucket(
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
    this.props.onChange(this.props.registrationPolicy.updateBucket(key, newBucket));
  }

  preventNoPreferenceSignupsChanged = (newValue) => {
    this.props.onChange(this.props.registrationPolicy.setPreventNoPreferenceSignups(newValue === 'true'));
  }

  isPreventNoPreferenceSignupsApplicable = () => (
    this.props.registrationPolicy.buckets
      .filter(bucket => bucket.get('slotsLimited'))
      .size > 1
  )

  deleteBucket = (key) => {
    this.props.onChange(this.props.registrationPolicy.deleteBucket(key));
  }

  presetSelected = (event) => {
    if (!this.props.presets) {
      return;
    }

    const name = event.target.value;

    if (name === '_custom') {
      this.setState({ preset: undefined, custom: true });
    } else {
      const preset = this.props.presets.find(p => p.name === name);
      this.setState(
        { preset, custom: false },
        () => {
          if (preset) {
            this.props.onChange(RegistrationPolicy.fromAPI(preset.policy));
          } else {
            this.props.onChange(new RegistrationPolicy());
          }
        },
      );
    }
  }

  renderHeaders = () => this.getHeaderLabels().map(label => <th key={label}>{label}</th>)

  renderAddButtons = () => {
    if (this.state.preset) {
      return null;
    }

    const hasAnythingBucket = !!this.props.registrationPolicy.getAnythingBucket();

    return (
      <ul className="list-inline">
        <li className="list-inline-item">
          <button className="btn btn-secondary" onClick={this.addBucket}>Add regular bucket</button>
        </li>
        <li className="list-inline-item">
          <button
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
      this.state.preset && !!this.state.preset.policy.buckets.find(presetBucket =>
        presetBucket.key === bucket.key)
    );

    const lockDelete = (
      bucketInPreset ||
      (this.props.lockDeleteBuckets && this.props.lockDeleteBuckets.includes(bucket.key))
    );

    const lockLimited = (
      bucketInPreset ||
      (this.props.lockLimitedBuckets && this.props.lockLimitedBuckets.includes(bucket.key))
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
    if (this.props.registrationPolicy.buckets.some(bucket => !bucket.get('slotsLimited'))) {
      return 'unlimited';
    }

    let [minimumSlots, preferredSlots, totalSlots] = [0, 0, 0];
    this.props.registrationPolicy.buckets.forEach((bucket) => {
      minimumSlots += bucket.get('minimumSlots') || 0;
      preferredSlots += bucket.get('preferredSlots') || 0;
      totalSlots += bucket.get('totalSlots') || 0;
    });

    return (
      <ul className="list-inline">
        <li className="list-inline-item">Minimum: {minimumSlots}</li>
        <li className="list-inline-item">Preferred: {preferredSlots}</li>
        <li className="list-inline-item">Total: {totalSlots}</li>
      </ul>
    );
  }

  renderTable = () => {
    const bucketRows = this.props.registrationPolicy.buckets.sort(bucketSortCompare).map(bucket =>
      this.renderBucketRow(bucket));

    return (
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
            <td colSpan={this.getHeaderLabels().findIndex(label => label === 'Limits')} />
            <td className="d-flex">
              <strong className="mr-2">Total capacity:</strong>
              {this.renderTotals()}
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderPresetSelector = () => {
    if (!this.props.presets) {
      return null;
    }

    let selectorValue;
    if (this.state.preset) {
      selectorValue = this.state.preset.name;
    } else if (this.state.custom) {
      selectorValue = '_custom';
    }

    const presetOptions = this.props.presets.map(preset => (
      <option value={preset.name} key={preset.name}>{preset.name}</option>
    ));

    const selectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={selectId}>
          Registration policy
          <select
            id={selectId}
            className="form-control"
            value={selectorValue || ''}
            onChange={this.presetSelected}
          >
            <option value="" disabled>Select one...</option>
            {presetOptions}
            <option value="_custom">Custom registration policy (advanced)</option>
          </select>
        </label>
      </div>
    );
  }

  renderPreventNoPreferenceSignupsDescription = () => {
    if (!this.isPreventNoPreferenceSignupsApplicable()) {
      return (
        <span>
          &quot;No preference&quot; option is inapplicable
          <HelpPopover className="ml-1">
            <p>{NO_PREFERENCE_HELP_TEXT}</p>
            <p className="mb-0">
              This event doesn&apos;t have more than one registration bucket with limited slots, so
              that option doesn&apos;t apply.
            </p>
          </HelpPopover>
        </span>
      );
    }

    const helpPopover = (
      <HelpPopover>{NO_PREFERENCE_HELP_TEXT}</HelpPopover>
    );

    if (this.props.registrationPolicy.getPreventNoPreferenceSignups()) {
      return <span>&quot;No preference&quot; option will not be available {helpPopover}</span>;
    }

    return <span>&quot;No preference&quot; option will be available {helpPopover}</span>;
  }

  renderPreventNoPreferenceSignupsRow = () => {
    if (this.state.preset || !this.isPreventNoPreferenceSignupsApplicable()) {
      return (
        <tr>
          <td>No preference</td>
          <td colSpan={this.getHeaderLabels().length - 1}>
            {this.renderPreventNoPreferenceSignupsDescription()}
          </td>
        </tr>
      );
    }

    const boolValue = this.props.registrationPolicy.getPreventNoPreferenceSignups();
    const choiceSetValue = (boolValue == null ? null : boolValue.toString());

    return (
      <tr>
        <td className="text-nowrap">
          No preference
          <HelpPopover className="ml-1">
            For events that have more than one registration bucket with limited slots, we can
            display a &quot;no preference&quot; option for signups. Users who sign up using that
            option will be placed in whatever limited-slot bucket has availability, and moved
            between buckets to make space as necessary.
          </HelpPopover>
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

  render = () => {
    if (this.props.presets) {
      const selectorRow = this.renderPresetSelector();

      if (this.state.preset || this.state.custom) {
        return (
          <div>
            {selectorRow}
            {this.renderTable()}
            {this.renderAddButtons()}
          </div>
        );
      }

      return selectorRow;
    }

    return (
      <div>
        {this.renderTable()}
        {this.renderAddButtons()}
      </div>
    );
  }
}

export default RegistrationPolicyEditor;
