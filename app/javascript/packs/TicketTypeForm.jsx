import React from 'react';
import PropTypes from 'prop-types';
import ScheduledValueEditor from './ScheduledValueEditor';
import { ScheduledValuePropType } from './ScheduledValuePropTypes';
import { fetchAndThrow, buildJSONFetchOptions } from './HTTPUtils';

class TicketTypeForm extends React.Component {
  static propTypes = {
    initialTicketType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      pricing_schedule: ScheduledValuePropType.isRequired,
    }).isRequired,
    baseUrl: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      ticketType: this.props.initialTicketType,
    };
  }

  setTicketTypeAttribute = (attribute, value) => {
    this.setState({ ticketType: Object.assign({}, this.state.ticketType, { [attribute]: value }) });
  }

  inputChanged = (event) => {
    const { name, value } = event.target;
    this.setTicketTypeAttribute(name, value);
  }

  pricingScheduleChanged = (newPricingSchedule) => {
    this.setTicketTypeAttribute('pricing_schedule', newPricingSchedule);
  }

  resourceUrl = () => {
    if (this.state.ticketType.id) {
      return `${this.props.baseUrl}/${this.state.ticketType.id}`;
    }

    return this.props.baseUrl;
  }

  isUpdate = () => this.state.ticketType.id

  submitClicked = (e) => {
    e.preventDefault();

    fetchAndThrow(this.resourceUrl(), buildJSONFetchOptions({
      method: (this.isUpdate() ? 'PATCH' : 'POST'),
      body: {
        ticket_type: this.state.ticketType,
      },
    })).then(() => {
      window.location.href = this.props.baseUrl;
    }).catch((error) => {
      alert(error.response.data);
    });
  }

  render = () => {
    const disableSubmit = !ScheduledValueEditor.isValid(this.state.ticketType.pricing_schedule);

    return (
      <form>
        <div className="form-group">
          <label htmlFor="name">
            Name (no spaces allowed &mdash; only letters, numbers, and underscores)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            style={{ fontFamily: 'monospace' }}
            value={this.state.ticketType.name}
            onChange={this.inputChanged}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            className="form-control"
            value={this.state.ticketType.description}
            onChange={this.inputChanged}
          />
        </div>

        <fieldset>
          <p>Pricing schedule</p>

          <ScheduledValueEditor
            timezone={this.props.timezone}
            scheduledValue={this.state.ticketType.pricing_schedule}
            setScheduledValue={this.pricingScheduleChanged}
          />
        </fieldset>

        <div className="form-group">
          <input
            type="submit"
            disabled={disableSubmit}
            onClick={this.submitClicked}
            className="btn btn-primary"
            value="Save ticket type configuration"
          />
        </div>
      </form>
    );
  }
}

export default TicketTypeForm;
