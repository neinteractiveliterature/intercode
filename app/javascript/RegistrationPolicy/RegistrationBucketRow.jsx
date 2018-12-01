import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';

import CommitableInput from '../BuiltInFormControls/CommitableInput';
import HelpPopover from '../UIComponents/HelpPopover';
import RegistrationPolicyBucket from './RegistrationPolicyBucket';

class RegistrationBucketRow extends React.Component {
  static propTypes = {
    registrationBucket: RegistrationPolicyBucket.propType.isRequired,
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
  }

  state = {
    isConfirmingDelete: false,
  };

  bucketPropsChanged = (newProps) => {
    const originalKey = this.props.registrationBucket.get('key');
    const newBucket = Object.keys(newProps).reduce(
      (bucket, propName) => bucket.set(propName, newProps[propName]),
      this.props.registrationBucket,
    );
    this.props.onChange(originalKey, newBucket);
  }

  bucketPropChanged = (propName, newValue) => {
    this.bucketPropsChanged({ [propName]: newValue });
  }

  nameChanged = newName => this.bucketPropChanged('name', newName)

  descriptionChanged = newDescription => this.bucketPropChanged('description', newDescription)

  slotsChanged = (event, field) => {
    const { registrationBucket } = this.props;

    this.props.onChange(
      registrationBucket.get('key'),
      registrationBucket.setSlotField(field, parseInt(event.target.value, 10)),
    );
  }

  unlimitedCheckboxChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.setSlotsLimited(!event.target.checked),
    );
  }

  countedCheckboxChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.set('notCounted', !event.target.checked),
    );
  }

  exposeAttendeesCheckboxChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.set('exposeAttendees', event.target.checked),
    );
  }

  beginDelete = (event) => {
    event.preventDefault();
    this.setState({ isConfirmingDelete: true });
  }

  confirmDelete = () => {
    this.props.onDelete(this.props.registrationBucket.get('key'));
  }

  cancelDelete = () => {
    this.setState({ isConfirmingDelete: false });
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
              checked={!this.props.registrationBucket.get('slotsLimited')}
              onChange={this.unlimitedCheckboxChanged}
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
              checked={!this.props.registrationBucket.get('notCounted')}
              onChange={this.countedCheckboxChanged}
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
                checked={this.props.registrationBucket.get('exposeAttendees')}
                onChange={this.exposeAttendeesCheckboxChanged}
              />
              {' '}
              Expose attendees?
            </label>
            <HelpPopover>
              If checked, attendees will be able to see which of their fellow attendees are in this
              bucket via the signup summary page.  (The signup summary always lists fellow attendees'
              names, but normally doesn't show which bucket they're in.)
            </HelpPopover>
          </div>
        </div>
      </div>
    );
  }

  renderLimits = () => {
    const bucket = this.props.registrationBucket;

    if (!bucket.get('slotsLimited')) {
      return null;
    }

    const slotControls = [
      {
        label: 'Min',
        field: 'minimumSlots',
        min: 0,
      },
      {
        label: 'Pref',
        field: 'preferredSlots',
        min: bucket.get('minimumSlots'),
      },
      {
        label: 'Max',
        field: 'totalSlots',
        min: bucket.get('preferredSlots'),
      },
    ].map(({
      label,
      field,
      min,
    }) => {
      const inputId = this.nextUniqueId();
      let value = bucket.get(field);
      if (value == null) {
        value = '';
      }

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
            value={value}
            onChange={(event) => { this.slotsChanged(event, field); }}
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
            onChange={this.nameChanged}
            placeholder="Bucket name"
          />
        </div>

        <CommitableInput
          value={this.props.registrationBucket.description}
          onChange={this.descriptionChanged}
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
        <button className="btn btn-sm btn-secondary" onClick={this.beginDelete} type="button">
          <i className="fa fa-trash-o" />
        </button>

        <ConfirmModal
          visible={this.state.isConfirmingDelete}
          onCancel={this.cancelDelete}
          onOK={this.confirmDelete}
        >
          <p>Are you sure you wish to delete this registration bucket?</p>
        </ConfirmModal>
      </td>
    );
  }

  render = () => (
    <tr className={classNames({ 'anything-bucket': this.props.registrationBucket.get('anything') })}>
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
