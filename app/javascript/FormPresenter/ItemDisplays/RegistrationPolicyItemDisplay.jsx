import React from 'react';

import { bucketSortCompare, findPreset, isPreventNoPreferenceSignupsApplicable } from '../../RegistrationPolicyUtils';
import NoPreferenceHelpPopover from '../../RegistrationPolicy/NoPreferenceHelpPopover';
import presets from '../../RegistrationPolicyPresets';
import RegistrationPolicy from '../../Models/RegistrationPolicy';

class RegistrationPolicyItemDisplay extends React.PureComponent {
  static propTypes = {
    value: RegistrationPolicy.apiRepresentationPropType.isRequired,
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
      bucket.get('notCounted') ? 'Not counted' : 'Counted',
      bucket.get('exposeAttendees') ? 'Expose attendees' : null,
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
            {bucket.get('minimumSlots')}
          </div>
          <div className="flex-grow-1">
            Pref:
            {' '}
            {bucket.get('preferredSlots')}
          </div>
          <div className="flex-grow-1">
            Max:
            {' '}
            {bucket.get('totalSlots')}
          </div>
        </div>
      </td>
      <td>
        {this.renderBucketOptions(bucket, preset)}
      </td>
    </tr>
  )

  renderPreventNoPreferenceSignupsRow = (registrationPolicy, preset, columnCount) => {
    if (preset || !isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
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
          {registrationPolicy.getPreventNoPreferenceSignups()
            ? <span>&quot;No preference&quot; option will not be available</span>
            : <span>&quot;No preference&quot; option will be available</span>
          }
          {' '}
          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </td>
      </tr>
    );
  }

  renderTotals = (registrationPolicy) => {
    if (!registrationPolicy.slotsLimited()) {
      return 'unlimited';
    }

    return (
      <React.Fragment>
        <div className="flex-grow-1">
          Min:
          {' '}
          {registrationPolicy.getMinimumSlots()}
        </div>
        <div className="flex-grow-1">
          Pref:
          {' '}
          {registrationPolicy.getPreferredSlots()}
        </div>
        <div className="flex-grow-1">
          Max:
          {' '}
          {registrationPolicy.getTotalSlots()}
        </div>
      </React.Fragment>
    );
  }

  render = () => {
    const registrationPolicy = RegistrationPolicy.fromAPI(this.props.value);
    const preset = findPreset(registrationPolicy, presets);
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
          {this.renderPreventNoPreferenceSignupsRow(registrationPolicy, preset, columnCount)}
          <tr>
            <td colSpan={columnCount - 2} className="text-right">
              <strong className="mr-2">Total capacity:</strong>
            </td>
            <td className="d-flex flex-column flex-lg-row">
              {this.renderTotals(registrationPolicy)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default RegistrationPolicyItemDisplay;
