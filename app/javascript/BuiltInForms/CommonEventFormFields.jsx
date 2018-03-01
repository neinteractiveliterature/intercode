import React from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';
import FormPresenterApp from '../FormPresenter';
import FormSectionContainer from '../FormPresenter/containers/FormSectionContainer';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';

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
      form_response_attrs: PropTypes.shape({}).isRequired,
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
    form: Form.propType.isRequired,
    convention: PropTypes.shape({}).isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  };

  static defaultProps = {
    canOverrideMaximumEventProvidedTickets: false,
    ticketName: null,
  };

  processFormResponseValue = (key, value) => {
    switch (key) {
      case 'can_play_concurrently':
        return (value === 'true');
      default:
        return value;
    }
  }

  formResponseValuesChanged = (newResponseValues) => {
    const processedResponseValues = Object.entries(newResponseValues).reduce(
      (processed, [key, value]) => ({
        ...processed,
        [key]: this.processFormResponseValue(key, value),
      }),
      {},
    );

    this.props.onChange({
      ...this.props.event,
      form_response_attrs: {
        ...this.props.event.form_response_attrs,
        ...processedResponseValues,
      },
    });
  }

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
      <FormPresenterApp form={this.props.form}>
        <FormSectionContainer
          convention={this.props.convention}
          form={this.props.form}
          section={this.props.form.getSections().get(0)}
          errors={{}}
          response={this.props.event.form_response_attrs}
          responseValuesChanged={this.formResponseValuesChanged}
        />
      </FormPresenterApp>

      {this.renderMaximumEventProvidedTicketsOverrideEditor()}
    </div>
  )
}

export default CommonEventFormFields;
