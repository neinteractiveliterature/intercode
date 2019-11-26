import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';

import Confirm from '../ModalDialogs/Confirm';
import HelpPopover from '../UIComponents/HelpPopover';
import { mutator, Transforms } from '../ComposableFormUtils';
import { RegistrationPolicyBucketPropType, setBucketProperties } from './RegistrationPolicyBucket';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

class RegistrationBucketRow extends React.Component {
  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.mutator = mutator({
      getState: () => this.props.registrationBucket,
      setState: (newState) => {
        this.props.onChange(
          this.props.registrationBucket.key,
          setBucketProperties(this.props.registrationBucket, newState),
        );
      },
      transforms: {
        name: Transforms.identity,
        description: Transforms.identity,
        slots_limited: Transforms.negate(Transforms.identity),
        not_counted: Transforms.negate(Transforms.identity),
        expose_attendees: Transforms.identity,
        minimum_slots: Transforms.integer,
        preferred_slots: Transforms.integer,
        total_slots: Transforms.integer,
      },
    });
  }

  renderBucketFlags = () => {
    if (this.props.lockLimited) {
      return null;
    }

    const unlimitedId = this.nextUniqueId();
    const countedId = this.nextUniqueId();
    const exposeAttendeesId = this.nextUniqueId();

    return (
      <div className="ml-2">
        <div className="form-check">
          <label className="form-check-label text-nowrap" htmlFor={unlimitedId}>
            <input
              id={unlimitedId}
              className="form-check-input"
              type="checkbox"
              checked={!this.props.registrationBucket.slots_limited}
              onChange={(event) => { this.mutator.slots_limited(event.target.checked); }}
            />

            Unlimited?
          </label>
        </div>

        <div className="form-check">
          <label className="form-check-label text-nowrap mr-1" htmlFor={countedId}>
            <input
              id={countedId}
              className="form-check-input"
              type="checkbox"
              checked={!this.props.registrationBucket.not_counted}
              onChange={(event) => { this.mutator.not_counted(event.target.checked); }}
            />

            Counted?
          </label>
          <HelpPopover>
            &ldquo;Counted&rdquo; buckets count towards the attendee&rsquo;s number of signups,
            and are included in the &ldquo;No Preference&rdquo; option. If the bucket is

            <em>not</em>

            counted, any attendees who click &ldquo;No Preference&rdquo; won&rsquo;t end up in this
            bucket.
          </HelpPopover>
        </div>

        <div className="form-check">
          <div className="d-flex">
            <label className="form-check-label text-nowrap mr-1" htmlFor={exposeAttendeesId}>
              <input
                id={exposeAttendeesId}
                className="form-check-input"
                type="checkbox"
                checked={this.props.registrationBucket.expose_attendees}
                onChange={(event) => { this.mutator.expose_attendees(event.target.checked); }}
              />

              Expose attendees?
            </label>
            <HelpPopover>
              If checked, attendees will be able to see which of their fellow attendees are in this
              bucket via the signup summary page.  (The signup summary always lists fellow
              attendees&rsquo; names, but normally doesn&rsquo;t show which bucket they&rsquo;re
              in.)
            </HelpPopover>
          </div>
        </div>
      </div>
    );
  }

  renderLimits = () => {
    const bucket = this.props.registrationBucket;

    if (!bucket.slots_limited) {
      return null;
    }

    if (this.props.lockCounts) {
      return null;
    }

    const slotControls = [
      {
        label: 'Min',
        field: 'minimum_slots',
        min: 0,
      },
      {
        label: 'Pref',
        field: 'preferred_slots',
        min: 0,
      },
      {
        label: 'Max',
        field: 'total_slots',
        min: 0,
      },
    ].map(({ label, field, min }) => {
      const inputId = this.nextUniqueId();

      return (
        <div key={field} className={this.props.lockLimited ? 'd-inline mr-2' : null}>
          <label htmlFor={inputId} className="d-inline">{label}</label>
          <input
            id={inputId}
            type="number"
            size="2"
            className="form-control form-control-sm d-inline ml-1"
            min={min}
            placeholder={label}
            value={bucket[field] || ''}
            onChange={(event) => { this.mutator[field](event.target.value); }}
            style={{ width: '4em' }}
          />
        </div>
      );
    });

    return (
      <div>
        {slotControls}
      </div>
    );
  }

  renderNameAndDescription = () => {
    if (this.props.lockNameAndDescription) {
      return (
        <td title={this.props.registrationBucket.description}>
          {this.props.registrationBucket.name}
        </td>
      );
    }

    return [
      <td key="nameAndDescription" style={{ width: '19rem' }}>
        <div className="mb-1">
          <BootstrapFormInput
            value={this.props.registrationBucket.name || ''}
            onTextChange={this.mutator.name}
            placeholder="Bucket name"
            label="Bucket name"
            hideLabel
            className={classNames('form-control', {
              'is-invalid': this.props.validateComplete && !this.props.registrationBucket.name,
            })}
            invalidFeedback="This field is required."
          />
        </div>

        <BootstrapFormTextarea
          rows="2"
          value={this.props.registrationBucket.description || ''}
          label="Bucket description"
          hideLabel
          onTextChange={this.mutator.description}
          placeholder="Bucket description"
          className={classNames('form-control', {
            'is-invalid': this.props.validateComplete && !this.props.registrationBucket.description,
          })}
          invalidFeedback="This field is required."
        />
      </td>,
    ];
  }

  renderActions = () => {
    if (this.props.lockDelete) {
      return <td style={{ width: 0 }} />;
    }

    return (
      <td style={{ width: '30px' }}>
        <Confirm.Trigger>
          {(confirm) => (
            <button
              className="btn btn-sm btn-secondary"
              type="button"
              onClick={() => confirm({
                prompt: 'Are you sure you wish to delete this registration bucket?',
                action: () => this.props.onDelete(this.props.registrationBucket.key),
              })}
            >
              <i className="fa fa-trash-o" />
              <span className="sr-only">Delete bucket</span>
            </button>
          )}
        </Confirm.Trigger>
      </td>
    );
  }

  render = () => (
    <tr className={classNames({ 'anything-bucket': this.props.registrationBucket.anything })}>
      {this.renderNameAndDescription()}
      <td style={{ width: '20rem' }}>
        <div className="d-flex">
          {this.renderLimits()}
          {this.renderBucketFlags()}
        </div>
      </td>
      {this.renderActions()}
    </tr>
  )
}

RegistrationBucketRow.propTypes = {
  registrationBucket: RegistrationPolicyBucketPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  lockCounts: PropTypes.bool,
  lockNameAndDescription: PropTypes.bool,
  lockLimited: PropTypes.bool,
  lockDelete: PropTypes.bool,
  validateComplete: PropTypes.bool,
};

RegistrationBucketRow.defaultProps = {
  lockCounts: false,
  lockNameAndDescription: false,
  lockLimited: false,
  lockDelete: false,
  validateComplete: false,
};

export default RegistrationBucketRow;
