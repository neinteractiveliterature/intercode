import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import RegistrationPolicy from '../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../BuiltInFormControls/RegistrationPolicyEditor';
import TimespanItem from '../FormPresenter/components/TimespanItem';
import presets from '../RegistrationPolicyPresets';

const isRegularEvent = event => (
  event.category !== 'volunteer_event' && event.category !== 'filler'
);

const buildRegistrationPolicy = (event) => {
  if (isRegularEvent(event)) {
    if (event.registration_policy == null) {
      return new RegistrationPolicy();
    }

    return RegistrationPolicy.fromAPI(event.registration_policy);
  }

  return null;
};

class CommonEventFormFields extends React.Component {
  static buildRegistrationPolicyForVolunteerEvent = totalSlots => ({
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
  });

  static propTypes = {
    event: PropTypes.shape({
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      organization: PropTypes.string.isRequired,
      con_mail_destination: PropTypes.oneOf(['event_email', 'gms']).isRequired,
      url: PropTypes.string.isRequired,
      short_blurb: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      participant_communications: PropTypes.string.isRequired,
      length_seconds: PropTypes.number,
      registration_policy: PropTypes.shape({
        buckets: PropTypes.arrayOf(PropTypes.shape({
          total_slots: PropTypes.number,
        }).isRequired).isRequired,
      }),
      can_play_concurrently: PropTypes.bool.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      registrationPolicy: buildRegistrationPolicy(props.event),
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ registrationPolicy: buildRegistrationPolicy(nextProps.event) });
  }

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

  canPlayConcurrentlyDidChange = (event) => {
    this.props.onChange({
      ...this.props.event,
      [event.target.name]: event.target.value === 'true',
    });
  }

  lengthSecondsDidChange = (lengthSeconds) => {
    this.props.onChange({
      ...this.props.event,
      length_seconds: lengthSeconds,
    });
  }

  registrationPolicyDidChange = (newRegistrationPolicy) => {
    this.setState(
      { registrationPolicy: newRegistrationPolicy },
      () => {
        this.props.onChange({
          ...this.props.event,
          registration_policy: newRegistrationPolicy.getAPIRepresentation(),
        });
      },
    );
  }

  totalSlotsForVolunteerEventDidChange = (event) => {
    this.props.onChange({
      ...this.props.event,
      registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(
        parseInt(event.target.value, 10),
      ),
    });
  }

  renderRegistrationPolicyInput = () => {
    if (this.props.event.category === 'volunteer_event') {
      const totalSlots = this.props.event.registration_policy.buckets[0].total_slots;
      let value = '';
      if (totalSlots != null) {
        value = totalSlots.toString();
      }

      return (
        <BootstrapFormInput
          type="number"
          name="total_slots"
          label="Volunteer slots in each run"
          value={value}
          onChange={this.totalSlotsForVolunteerEventDidChange}
        />
      );
    } else if (this.props.event.category === 'filler') {
      return null;
    }

    return (
      <div className="card my-4">
        <div className="card-header">Registration options</div>
        <div className="card-body">
          <RegistrationPolicyEditor
            registrationPolicy={this.state.registrationPolicy}
            onChange={this.registrationPolicyDidChange}
            presets={presets}
          />

          <fieldset className="form-group">
            <legend className="col-form-legend">Can this event be played concurrently with other events?</legend>

            <BootstrapFormCheckbox
              type="radio"
              name="can_play_concurrently"
              value="true"
              className="form-check-inline"
              checked={this.props.event.can_play_concurrently}
              onChange={this.canPlayConcurrentlyDidChange}
              label="Yes"
            />

            <BootstrapFormCheckbox
              type="radio"
              name="can_play_concurrently"
              value="false"
              className="form-check-inline"
              checked={!this.props.event.can_play_concurrently}
              onChange={this.canPlayConcurrentlyDidChange}
              label="No"
            />
          </fieldset>
        </div>
      </div>
    );
  }

  renderAuthorField = () => {
    if (!isRegularEvent(this.props.event)) {
      return null;
    }

    return (
      <BootstrapFormInput
        name="author"
        label="Author(s)"
        value={this.props.event.author}
        onChange={this.formInputDidChange}
      />
    );
  }

  renderConMailDestinationField = () => {
    if (!isRegularEvent(this.props.event)) {
      return null;
    }

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">Send convention email to:</legend>

        <BootstrapFormCheckbox
          type="radio"
          name="con_mail_destination"
          value="event_email"
          checked={this.props.event.con_mail_destination === 'event_email'}
          onChange={this.formInputDidChange}
          label="Event email address"
        />

        <BootstrapFormCheckbox
          type="radio"
          name="con_mail_destination"
          value="gms"
          checked={this.props.event.con_mail_destination === 'gms'}
          onChange={this.formInputDidChange}
          label="Individual team members for this event"
        />

      </fieldset>
    );
  }

  renderOrganizationField = () => {
    if (!isRegularEvent(this.props.event)) {
      return null;
    }

    return (
      <BootstrapFormInput
        name="organization"
        label="Organization"
        value={this.props.event.organization}
        onChange={this.formInputDidChange}
      />
    );
  }

  renderParticipantCommunicationsField = () => {
    if (!isRegularEvent(this.props.event)) {
      return null;
    }

    return (
      <BootstrapFormTextarea
        name="participant_communications"
        label="Participant communications"
        value={this.props.event.participant_communications}
        onChange={this.formInputDidChange}
        rows={4}
      />
    );
  }

  renderUrlField = () => {
    if (!isRegularEvent(this.props.event)) {
      return null;
    }

    return (
      <BootstrapFormInput
        name="url"
        label="URL of event homepage"
        value={this.props.event.url}
        onChange={this.formInputDidChange}
      />
    );
  }

  render = () => (
    <div>
      <BootstrapFormInput
        name="title"
        label="Title"
        value={this.props.event.title}
        onChange={this.formInputDidChange}
      />
      {this.renderAuthorField()}
      <BootstrapFormInput
        type="email"
        name="email"
        label="Contact email"
        value={this.props.event.email}
        onChange={this.formInputDidChange}
      />
      {this.renderOrganizationField()}
      {this.renderUrlField()}
      {this.renderConMailDestinationField()}
      <TimespanItem
        formItem={{ properties: { caption: this.getLengthSecondsCaption() } }}
        value={this.props.event.length_seconds}
        onChange={this.lengthSecondsDidChange}
      />
      {this.renderRegistrationPolicyInput()}
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
      {this.renderParticipantCommunicationsField()}
    </div>
  )
}

export default CommonEventFormFields;
