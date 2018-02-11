import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
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
      id: PropTypes.number,
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      organization: PropTypes.string.isRequired,
      con_mail_destination: PropTypes.oneOf(['event_email', 'gms']).isRequired,
      url: PropTypes.string,
      short_blurb: PropTypes.string,
      description: PropTypes.string,
      participant_communications: PropTypes.string,
      content_warnings: PropTypes.string,
      age_restrictions: PropTypes.string,
      length_seconds: PropTypes.number,
      registration_policy: PropTypes.shape({
        buckets: PropTypes.arrayOf(PropTypes.shape({
          total_slots: PropTypes.number,
        }).isRequired).isRequired,
      }),
      can_play_concurrently: PropTypes.bool.isRequired,
      maximum_event_provided_tickets_overrides: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
    canOverrideMaximumEventProvidedTickets: PropTypes.bool,
    ticketTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      maximum_event_provided_tickets: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    ticketName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  };

  static defaultProps = {
    canOverrideMaximumEventProvidedTickets: false,
    ticketName: null,
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
      registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(parseInt(event.target.value, 10)),
    });
  }

  regularEventFieldRenderer = renderFunc => (
    (...args) => {
      if (!isRegularEvent(this.props.event)) {
        return null;
      }

      return renderFunc(...args);
    }
  )

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

    const currentValue = this.props.event.can_play_concurrently;

    const choices = [['Yes', true], ['No', false]].map(([label, value]) => (
      <BootstrapFormCheckbox
        key={`can_play_concurrently_${value}`}
        type="radio"
        name="can_play_concurrently"
        value={value.toString()}
        className="form-check-inline"
        checked={value ? currentValue : !currentValue}
        onChange={this.canPlayConcurrentlyDidChange}
        label={label}
      />
    ));

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
            <legend className="col-form-label">Can this event be played concurrently with other events?</legend>
            {choices}
          </fieldset>
        </div>
      </div>
    );
  }

  renderConMailDestinationField = this.regularEventFieldRenderer(() => {
    const choices = [
      ['Event email address', 'event_email'],
      ['Team members who have elected to receive email from the convention', 'gms'],
    ].map(([label, value]) => (
      <BootstrapFormCheckbox
        key={`con_mail_destination_${value}`}
        type="radio"
        name="con_mail_destination"
        value={value}
        checked={this.props.event.con_mail_destination === value}
        onChange={this.formInputDidChange}
        label={label}
      />
    ));

    return (
      <fieldset className="form-group">
        <legend className="col-form-label">Send convention email to:</legend>
        {choices}
      </fieldset>
    );
  })

  renderParticipantCommunicationsField = this.regularEventFieldRenderer(() => (
    <BootstrapFormTextarea
      name="participant_communications"
      label="Participant communications"
      value={this.props.event.participant_communications || ''}
      onChange={this.formInputDidChange}
      rows={4}
    />
  ))

  renderSimpleRegularEventInput = this.regularEventFieldRenderer((name, label) => (
    <BootstrapFormInput
      name={name}
      label={label}
      value={this.props.event[name] || ''}
      onChange={this.formInputDidChange}
    />
  ))

  renderMaximumEventProvidedTicketsOverrideEditor = () => {
    if (!this.props.canOverrideMaximumEventProvidedTickets) {
      return null;
    }

    return (
      <MaximumEventProvidedTicketsOverrideEditor
        eventId={this.props.event.id}
        ticketTypes={this.props.ticketTypes}
        ticketName={this.props.ticketName}
        overrides={this.props.event.maximum_event_provided_tickets_overrides}
        createOverride={this.props.createMaximumEventProvidedTicketsOverride}
        deleteOverride={this.props.deleteMaximumEventProvidedTicketsOverride}
        updateOverride={this.props.updateMaximumEventProvidedTicketsOverride}
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
      {this.renderSimpleRegularEventInput('author', 'Author(s)')}
      <BootstrapFormInput
        type="email"
        name="email"
        label="Contact email"
        value={this.props.event.email}
        onChange={this.formInputDidChange}
      />
      {this.renderSimpleRegularEventInput('organization', 'Organization')}
      {this.renderSimpleRegularEventInput('url', 'URL of event homepage')}
      {this.renderConMailDestinationField()}
      <TimespanItem
        formItem={{ properties: { caption: this.getLengthSecondsCaption() } }}
        value={this.props.event.length_seconds}
        onChange={this.lengthSecondsDidChange}
        onInteract={() => {}}
      />
      {this.renderRegistrationPolicyInput()}
      <BootstrapFormTextarea
        name="short_blurb"
        label="Short blurb"
        value={this.props.event.short_blurb || ''}
        onChange={this.formInputDidChange}
        rows={4}
      />
      <BootstrapFormTextarea
        name="description"
        label="Description"
        value={this.props.event.description || ''}
        onChange={this.formInputDidChange}
        rows={10}
      />
      <BootstrapFormTextarea
        name="content_warnings"
        label="Content warnings"
        value={this.props.event.content_warnings || ''}
        onChange={this.formInputDidChange}
        rows={4}
      />
      <BootstrapFormTextarea
        name="age_restrictions"
        label="Age restrictions"
        value={this.props.event.age_restrictions || ''}
        onChange={this.formInputDidChange}
        rows={4}
      />
      {this.renderParticipantCommunicationsField()}
      {this.renderMaximumEventProvidedTicketsOverrideEditor()}
    </div>
  )
}

export default CommonEventFormFields;
