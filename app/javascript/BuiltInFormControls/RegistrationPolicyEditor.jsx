// @flow

import React from 'react';
import { enableUniqueIds } from 'react-html-id';
import { List } from 'immutable';
import RegistrationBucketRow from './RegistrationBucketRow';
import RegistrationPolicy from '../Models/RegistrationPolicy';
import RegistrationPolicyBucket from '../Models/RegistrationPolicyBucket';
import type { RegistrationPolicyAPIRepresentation } from '../Models/RegistrationPolicy';

export type RegistrationPolicyPreset = {
  name: string,
  policy: RegistrationPolicyAPIRepresentation,
};

type Props = {
  registrationPolicy: RegistrationPolicy,
  onChange: (RegistrationPolicy) => void,
  lockNameAndDescription: boolean,
  lockLimitedBuckets?: Array<string>,
  lockDeleteBuckets?: Array<string>,
  showKey: boolean,
  presets?: Array<RegistrationPolicyPreset>,
};

type State = {
  custom: boolean,
  preset?: RegistrationPolicyPreset,
};

class RegistrationPolicyEditor extends React.Component {
  static defaultProps = {
    lockNameAndDescription: false,
    lockLimitedBuckets: null,
    lockDeleteBuckets: null,
    showKey: true,
    presets: [],
  }

  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);

    let initialPreset;
    let initiallyCustom = false;
    if (Array.isArray(this.props.presets)) {
      initialPreset = this.props.presets.find(preset => (
        preset.policy.buckets.every(
          bucket => (
            typeof bucket.key === 'string' &&
            this.props.registrationPolicy.getBucket(bucket.key)
          ),
        ) &&
        this.props.registrationPolicy.buckets.every(
          bucket => preset.policy.buckets.find(
            presetBucket => presetBucket.key === bucket.key,
          ),
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

  state: State

  getHeaderLabels = () => [
    ...(this.props.showKey ? ['Key'] : []),
    'Name',
    ...(this.props.lockNameAndDescription ? [] : ['Description']),
    'Limits',
    '',
  ]

  props: Props

  nextUniqueId: () => string

  addBucket = (event: SyntheticInputEvent) => {
    event.preventDefault();
    this.props.onChange(this.props.registrationPolicy.addBucket('untitled'));
  }

  addAnythingBucket = (event: SyntheticInputEvent) => {
    event.preventDefault();
    this.props.onChange(this.props.registrationPolicy.addBucket(
      'anything',
      { anything: true },
    ));
  }

  bucketChanged = (key: string, newBucket: RegistrationPolicyBucket) => {
    this.props.onChange(this.props.registrationPolicy.updateBucket(key, newBucket));
  }

  deleteBucket = (key: string) => {
    this.props.onChange(this.props.registrationPolicy.deleteBucket(key));
  }

  presetSelected = (event: SyntheticInputEvent) => {
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
            onClick={this.addAnythingBucket}
          >
              Add anything bucket
          </button>
        </li>
      </ul>
    );
  }

  renderTable = () => {
    const bucketRows = this.props.registrationPolicy.buckets.map((bucket) => {
      const bucketInPreset = (
        this.state.preset && !!this.state.preset.policy.buckets.find(
          presetBucket => presetBucket.key === bucket.key,
        )
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
          showKey={this.props.showKey && !bucketInPreset}
          lockNameAndDescription={bucketInPreset || this.props.lockNameAndDescription}
          lockLimited={lockLimited}
          lockDelete={lockDelete}
        />
      );
    });

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
        <label htmlFor={selectId}>Registration policy</label>
        <select id={selectId} className="form-control" value={selectorValue} onChange={this.presetSelected}>
          <option value="" />
          {presetOptions}
          <option value="_custom">Custom registration policy (advanced)</option>
        </select>
      </div>
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
