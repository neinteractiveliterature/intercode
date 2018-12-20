import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';

import CommitableInput from '../BuiltInFormControls/CommitableInput';
import Confirm from '../ModalDialogs/Confirm';
import HelpPopover from '../UIComponents/HelpPopover';
import { mutator, Transforms } from '../ComposableFormUtils';
import { RegistrationPolicyBucketPropType, setBucketProperties } from './RegistrationPolicyBucket';

class RegistrationBucketRow extends React.Component {
  static propTypes = {
    registrationBucket: RegistrationPolicyBucketPropType.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    lockNameAndDescription: PropTypes.bool,
    lockLimited: PropTypes.bool,
    lockDelete: PropTypes.bool,
  };

  static defaultProps = {
    lockNameAndDescription: false,
    lockLimited: false,
    lockDelete: false,
  };

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
        slots_limited: Transforms.negate(Transforms.checkboxChange),
        not_counted: Transforms.negate(Transforms.checkboxChange),
        expose_attendees: Transforms.checkboxChange,
        minimum_slots: Transforms.parseInt(Transforms.textInputChange),
        preferred_slots: Transforms.parseInt(Transforms.textInputChange),
        total_slots: Transforms.parseInt(Transforms.textInputChange),
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
              onChange={this.mutator.slots_limited}
            />
            {' '}
            Unlimited?
          </label>
        </div>

        <div className="form-check">
          <label className="form-check-label text-nowrap" htmlFor={countedId}>
            <input
              id={countedId}
              className="form-check-input"
              type="checkbox"
              checked={!this.props.registrationBucket.not_counted}
              onChange={this.mutator.not_counted}
            />
            {' '}
            Counted?
          </label>
        </div>

        <div className="form-check">
          <div className="d-flex">
            <label className="form-check-label text-nowrap mr-1" htmlFor={exposeAttendeesId}>
              <input
                id={exposeAttendeesId}
                className="form-check-input"
                type="checkbox"
                checked={this.props.registrationBucket.expose_attendees}
                onChange={this.mutator.expose_attendees}
              />
              {' '}
              Expose attendees?
            </label>
            <HelpPopover>
              If checked, attendees will be able to see which of their fellow attendees are in this
              bucket via the signup summary page.  (The signup summary always lists fellow attendees&apos;
              names, but normally doesn&apos;t show which bucket they&apos;re in.)
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
            onChange={this.mutator[field]}
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
          <CommitableInput
            value={this.props.registrationBucket.name}
            onChange={this.mutator.name}
            placeholder="Bucket name"
          />
        </div>

        <CommitableInput
          value={this.props.registrationBucket.description}
          onChange={this.mutator.description}
          renderInput={props => <textarea rows={2} {...props} />}
          placeholder="Bucket description"
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
          {confirm => (
            <button
              className="btn btn-sm btn-secondary"
              type="button"
              onClick={() => confirm({
                prompt: 'Are you sure you wish to delete this registration bucket?',
                action: () => this.props.onDelete(this.props.registrationBucket.key),
              })}
            >
              <i className="fa fa-trash-o" />
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

export default RegistrationBucketRow;
