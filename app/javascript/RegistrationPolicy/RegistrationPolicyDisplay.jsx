import React from 'react';
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

class RegistrationPolicyDisplay extends React.PureComponent {
  static propTypes = {
    presets: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      policy: RegistrationPolicyPropType.isRequired,
    }).isRequired),
    registrationPolicy: RegistrationPolicyPropType.isRequired,
  };

  static defaultProps = {
    presets: null,
  };

  renderPresetName = (preset) => {
    if (preset) {
      return preset.name;
    }

    return 'Custom registration policy';
  }

  renderBucketOptions = (bucket, preset) => {
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

  renderBucketRow = (bucket, preset) => (
    <tr key={bucket.key}>
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
        {this.renderBucketOptions(bucket, preset)}
      </td>
    </tr>
  )

  renderPreventNoPreferenceSignupsRow = (preset, columnCount) => {
    if (!isPreventNoPreferenceSignupsApplicable(this.props.registrationPolicy)) {
      return (
        <tr>
          <td colSpan={columnCount}>
            &quot;No preference&quot; option is inapplicable
            {' '}
            <NoPreferenceHelpPopover registrationPolicy={this.props.registrationPolicy} />
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td colSpan={columnCount}>
          {this.props.registrationPolicy.prevent_no_preference_signups
            ? <span>&quot;No preference&quot; option will not be available</span>
            : <span>&quot;No preference&quot; option will be available</span>
          }
          {' '}
          <NoPreferenceHelpPopover registrationPolicy={this.props.registrationPolicy} />
        </td>
      </tr>
    );
  }

  renderTotals = () => {
    if (!this.props.registrationPolicy.buckets.some(bucket => bucket.slots_limited)) {
      return 'unlimited';
    }

    return (
      <React.Fragment>
        <div className="flex-grow-1">
          Min:
          {' '}
          {sumMinimumSlots(this.props.registrationPolicy)}
        </div>
        <div className="flex-grow-1">
          Pref:
          {' '}
          {sumPreferredSlots(this.props.registrationPolicy)}
        </div>
        <div className="flex-grow-1">
          Max:
          {' '}
          {sumTotalSlots(this.props.registrationPolicy)}
        </div>
      </React.Fragment>
    );
  }

  renderPolicyTable = () => {
    const { registrationPolicy } = this.props;
    const preset = findPreset(registrationPolicy, this.props.presets);
    const columnCount = preset ? 3 : 4;

    return (
      <table className="table">
        <thead>
          <tr>
            <th className="table-dark bg-black py-1 border-0" colSpan={columnCount}>
              {this.renderPresetName(preset)}
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
          {
            registrationPolicy.buckets
              .sort(bucketSortCompare)
              .map(bucket => this.renderBucketRow(bucket, preset))
          }
        </tbody>
        <tfoot>
          {this.renderPreventNoPreferenceSignupsRow(preset, columnCount)}
          <tr>
            <td colSpan={columnCount - 2} className="text-right">
              <strong className="mr-2">Total capacity:</strong>
            </td>
            <td className="d-flex flex-column flex-lg-row">
              {this.renderTotals()}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    );
  }

  render = () => (
    <div className="card">
      <div className="card-header">
        Registration policy
      </div>
      <div className="d-flex flex-column flex-lg-row">
        <div className="col-lg-8 p-3">
          {this.renderPolicyTable()}
        </div>
        <RegistrationPolicyPreview
          registrationPolicy={this.props.registrationPolicy}
        />
      </div>
    </div>
  )
}

export default RegistrationPolicyDisplay;
