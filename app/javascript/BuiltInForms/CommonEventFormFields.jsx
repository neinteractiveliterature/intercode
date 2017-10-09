import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import TimespanItem from '../FormPresenter/components/TimespanItem';

class CommonEventFormFields extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      short_blurb: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      length_seconds: PropTypes.number,
      registration_policy: PropTypes.shape({
        buckets: PropTypes.arrayOf({
          total_slots: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    length_seconds: null,
  };

  getLengthSecondsCaption = () => {
    if (this.props.event.category === 'volunteer_event') {
      return 'Length of each run';
    }

    return 'Length';
  }

  formInputDidChange = (event) => {
    this.props.onChange({
      ...this.props.event,
      [event.target.name]: event.target.value,
    });
  }

  totalSlotsForVolunteerEventDidChange = (totalSlots) => {
    this.props.onChange({
      ...this.props.event,
      registration_policy: {
        buckets: [
          {
            key: 'signups',
            name: 'Signups',
            description: 'Signups for this event',
            anything: false,
            slots_limited: true,
            minimum_slots: 1,
            preferred_slots: totalSlots,
            total_slots: totalSlots,
          },
        ],
      },
    });
  }

  renderRegistrationPolicyInput = () => {
    if (this.props.event.category === 'volunteer_event') {
      return (
        <BootstrapFormInput
          type="number"
          name="total_slots"
          label="Volunteer slots in each run"
          value={this.props.event.registration_policy.buckets[0].total_slots || ''}
          onChange={this.totalSlotsForVolunteerEventDidChange}
        />
      );
    } else if (this.props.event.category === 'filler') {
      return null;
    }

    // TODO: put the full-fledged registration policy editor
    return null;
  }

  render = () => (
    <div>
      <BootstrapFormInput
        name="title"
        label="Title"
        value={this.props.event.title}
        onChange={this.formInputDidChange}
      />
      <BootstrapFormInput
        type="email"
        name="email"
        label="Contact email"
        value={this.props.event.email}
        onChange={this.formInputDidChange}
      />
      <BootstrapFormTextarea
        name="short_blurb"
        label="Short blurb"
        value={this.props.event.short_blurb}
        onChange={this.formInputDidChange}
        rows={4}
      />
      <BootstrapFormTextarea
        name="description"
        label="Description"
        value={this.props.event.description}
        onChange={this.formInputDidChange}
        rows={10}
      />
      <TimespanItem
        formItem={{ properties: { caption: this.getLengthSecondsCaption() } }}
        value={this.props.event.length_seconds}
        onChange={this.lengthSecondsDidChange}
      />
      {this.renderRegistrationPolicyInput()}
    </div>
  )
}

export default CommonEventFormFields;
