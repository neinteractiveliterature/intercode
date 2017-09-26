import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import { enableUniqueIds } from 'react-html-id';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../../BuiltInFormControls/BootstrapFormTextarea';
import TimespanItem from '../../FormPresenter/components/TimespanItem';
import eventsQuery from '../eventsQuery';
import { createVolunteerEventMutation } from '../mutations';

@withRouter
@graphql(createVolunteerEventMutation, { name: 'createVolunteerEvent' })
class CreateVolunteerEventForm extends React.Component {
  static propTypes = {
    createVolunteerEvent: PropTypes.func.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      title: '',
      email: '',
      short_blurb: '',
      description: '',
      length_seconds: null,
      total_slots: null,
    };
  }

  isDataComplete = () => (
    this.state.title && this.state.email &&
    this.state.short_blurb && this.state.description &&
    this.state.length_seconds > 0 && this.state.total_slots > 0
  )

  formInputDidChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  lengthSecondsDidChange = (lengthSeconds) => {
    this.setState({ length_seconds: lengthSeconds });
  }

  createEvent = () => {
    const { title, email, short_blurb, description, length_seconds, total_slots } = this.state;

    return this.props.createVolunteerEvent({
      variables: {
        input: {
          title,
          email,
          short_blurb,
          description,
          length_seconds,
          total_slots: parseInt(total_slots, 10),
        },
      },
      update: (store, { data: { createVolunteerEvent: { event: newEvent } } }) => {
        const eventsData = store.readQuery({ query: eventsQuery });
        eventsData.events.push(newEvent);
        store.writeQuery({ query: eventsQuery, data: eventsData });
        this.props.history.replace('/volunteer_events');
      },
    });
  }

  renderFormBody = () => (
    <div>
      <BootstrapFormInput
        name="title"
        label="Title"
        value={this.state.title}
        onChange={this.formInputDidChange}
      />
      <BootstrapFormInput
        type="email"
        name="email"
        label="Contact email"
        value={this.state.email}
        onChange={this.formInputDidChange}
      />
      <BootstrapFormTextarea
        name="short_blurb"
        label="Short blurb"
        value={this.state.short_blurb}
        onChange={this.formInputDidChange}
        rows={4}
      />
      <BootstrapFormTextarea
        name="description"
        label="Description"
        value={this.state.description}
        onChange={this.formInputDidChange}
        rows={10}
      />
      <TimespanItem
        formItem={{ properties: { caption: 'Length of each run' } }}
        value={this.state.length_seconds}
        onChange={this.lengthSecondsDidChange}
      />
      <BootstrapFormInput
        type="number"
        name="total_slots"
        label="Volunteer slots in each run"
        value={this.state.total_slots || ''}
        onChange={this.formInputDidChange}
      />
    </div>
  )

  render = () => (
    <div className="my-4">
      <h2 className="mb-3">Create volunteer event</h2>
      {this.renderFormBody()}
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.createEvent}
          disabled={!this.isDataComplete()}
        >
          Create event
        </button>
        <Link className="btn btn-link" to="/volunteer_events">
          Cancel
        </Link>
      </div>
    </div>
  )
}

export default CreateVolunteerEventForm;
