import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';
import InPlaceEditor from './InPlaceEditor';
import RegistrationPolicyBucket from '../Models/RegistrationPolicyBucket';

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

  renderUnlimitedCheckbox = () => {
    if (this.props.lockLimited) {
      return null;
    }

    const inputId = this.nextUniqueId();

    return (
      <div className="form-check form-check-inline mr-2">
        <label className="form-check-label text-nowrap" htmlFor={inputId}>
          <input
            id={inputId}
            className="form-check-input"
            type="checkbox"
            checked={!this.props.registrationBucket.get('slotsLimited')}
            onChange={this.unlimitedCheckboxChanged}
          />
          {' '}
          Unlimited?
        </label>
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
    }, i) => {
      const inputId = this.nextUniqueId();
      let value = bucket.get(field);
      if (value == null) {
        value = '';
      }

      return (
        <div className={classNames('d-inline-flex', { 'ml-1': i > 0 })} key={field}>
          <label htmlFor={inputId}>{label}</label>
          <input
            id={inputId}
            type="number"
            size="2"
            className="form-control form-control-sm ml-1"
            min={min}
            placeholder="Min"
            value={value}
            onChange={(event) => { this.slotsChanged(event, field); }}
            style={{ width: '4em' }}
          />
        </div>
      );
    });

    return (
      <div className="form-inline ml-1 flex-nowrap">
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
      <td key="name">
        <InPlaceEditor
          value={this.props.registrationBucket.name}
          onChange={this.nameChanged}
        />
      </td>,

      <td key="description">
        <InPlaceEditor
          value={this.props.registrationBucket.description}
          onChange={this.descriptionChanged}
        />
      </td>,
    ];
  }

  renderActions = () => {
    if (this.props.lockDelete) {
      return <td />;
    }

    return (
      <td>
        <button className="btn btn-sm btn-secondary" onClick={this.beginDelete}>
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
      <td className="d-flex">
        {this.renderUnlimitedCheckbox()}
        {this.renderLimits()}
      </td>
      {this.renderActions()}
    </tr>
  )
}

export default RegistrationBucketRow;
