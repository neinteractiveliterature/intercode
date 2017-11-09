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
    showKey: PropTypes.bool,
  };

  static defaultProps = {
    lockNameAndDescription: false,
    lockLimited: false,
    lockDelete: false,
    showKey: true,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  state = {
    isConfirmingDelete: false,
  };

  bucketPropChanged = (propName, newValue) => {
    const originalKey = this.props.registrationBucket.get('key');
    this.props.onChange(originalKey, this.props.registrationBucket.set(propName, newValue));
  }

  keyChanged = newKey => this.bucketPropChanged('key', newKey)
  nameChanged = newName => this.bucketPropChanged('name', newName)
  descriptionChanged = newDescription => this.bucketPropChanged('description', newDescription)

  minimumSlotsChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.setMinimumSlots(parseInt(event.target.value, 10)),
    );
  }

  preferredSlotsChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.setPreferredSlots(parseInt(event.target.value, 10)),
    );
  }

  totalSlotsChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.setTotalSlots(parseInt(event.target.value, 10)),
    );
  }

  slotsLimitedChanged = (event) => {
    this.props.onChange(
      this.props.registrationBucket.get('key'),
      this.props.registrationBucket.setSlotsLimited(event.target.checked),
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

  renderLimitedCheckbox = () => {
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
            checked={this.props.registrationBucket.get('slotsLimited')}
            onChange={this.slotsLimitedChanged}
          />
          {' '}
          Limited?
        </label>
      </div>
    );
  }

  renderLimits = () => {
    const bucket = this.props.registrationBucket;

    if (!bucket.get('slotsLimited')) {
      return null;
    }

    const minId = this.nextUniqueId();
    const prefId = this.nextUniqueId();
    const maxId = this.nextUniqueId();

    return (
      <div className="form-inline ml-1 flex-nowrap">
        <div className="d-inline-flex mr-1">
          <label htmlFor={minId}>Min</label>
          <input
            id={minId}
            type="number"
            size="2"
            className="form-control form-control-sm"
            min="0"
            placeholder="Min"
            value={bucket.get('minimumSlots') || ''}
            onChange={this.minimumSlotsChanged}
            style={{ width: '4em' }}
          />
        </div>

        <div className="d-inline-flex mr-1">
          <label htmlFor={prefId}>Pref</label>
          <input
            id={prefId}
            type="number"
            size="2"
            className="form-control form-control-sm"
            min={bucket.get('minimumSlots')}
            placeholder="Pref"
            value={bucket.get('preferredSlots') || ''}
            onChange={this.preferredSlotsChanged}
            style={{ width: '4em' }}
          />
        </div>

        <div className="d-inline-flex">
          <label htmlFor={maxId}>Max</label>
          <input
            id={maxId}
            type="number"
            size="2"
            className="form-control form-control-sm"
            min={bucket.get('preferredSlots')}
            placeholder="Max"
            value={bucket.get('totalSlots') || ''}
            onChange={this.totalSlotsChanged}
            style={{ width: '4em' }}

          />
        </div>
      </div>
    );
  }

  renderKey = () => {
    if (!this.props.showKey) {
      return null;
    }

    return (
      <td>
        <InPlaceEditor
          value={this.props.registrationBucket.key}
          onChange={this.keyChanged}
        >
          <code>{this.props.registrationBucket.key}</code>
        </InPlaceEditor>
      </td>
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
      {this.renderKey()}
      {this.renderNameAndDescription()}
      <td className="d-flex">
        {this.renderLimitedCheckbox()}
        {this.renderLimits()}
      </td>
      {this.renderActions()}
    </tr>
  )
}

export default RegistrationBucketRow;
