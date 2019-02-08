import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { humanize } from 'inflected';

import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import CommonEventFormFields from './CommonEventFormFields';
import ErrorDisplay from '../ErrorDisplay';
import Form from '../Models/Form';
import { getIncompleteItems } from '../FormPresenter/FormPresenterUtils';
import ItemInteractionTracker from '../FormPresenter/ItemInteractionTracker';

class EventForm extends React.Component {
  static propTypes = {
    initialEvent: PropTypes.shape({
      id: PropTypes.number,
      maximum_event_provided_tickets_overrides: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    showCategorySelect: PropTypes.bool,
    showDropButton: PropTypes.bool,
    canOverrideMaximumEventProvidedTickets: PropTypes.bool,
    ticketTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      maximum_event_provided_tickets: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    ticketName: PropTypes.string,
    form: Form.propType.isRequired,
    convention: PropTypes.shape({
      event_categories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,

    cancelPath: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
    updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cancelPath: null,
    disabled: false,
    error: null,
    showDropButton: false,
    showCategorySelect: false,
    canOverrideMaximumEventProvidedTickets: false,
    ticketName: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: props.initialEvent,
      droppingEvent: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const nextOverrides = nextProps.initialEvent.maximum_event_provided_tickets_overrides;
    this.setState(prevState => ({
      event: {
        ...prevState.event,
        maximum_event_provided_tickets_overrides: nextOverrides,
      },
    }));
  }

  beginDrop = (event) => {
    event.preventDefault();
    this.setState({ droppingEvent: true });
  }

  confirmDrop = (event) => {
    event.preventDefault();
    this.props.onDrop();
  }

  cancelDrop = (event) => {
    event.preventDefault();
    this.setState({ droppingEvent: false });
  }

  eventChanged = (eventData) => {
    this.setState({ event: eventData });
  }

  saveClicked = (event, onInteract) => {
    event.preventDefault();
    if (this.validateComplete(onInteract)) {
      this.props.onSave(this.state.event);
    }
  }

  validateComplete = (onInteract) => {
    const { form } = this.props;
    const response = this.state.event.form_response_attrs;
    const incompleteItems = getIncompleteItems(form.getAllItems(), response);

    if (incompleteItems.length === 0) {
      this.setState({ error: null });
      return true;
    }

    incompleteItems.forEach((item) => {
      if (item.identifier) {
        onInteract(item.identifier);
      }
    });

    this.setState({ error: `Please fill out the following required fields: ${incompleteItems.map(item => item.properties.caption).join(', ')}` });

    return false;
  }

  renderHeader = () => {
    let dropButton = null;
    if (this.props.showDropButton && this.state.event.id && this.state.event.status !== 'dropped') {
      dropButton = (
        <button type="button" className="btn btn-outline-danger float-right" onClick={this.beginDrop}>
          Drop event
        </button>
      );
    }

    return (
      <header>
        {dropButton}

        <h3 className="mb-4">
          {this.state.event.id ? 'Edit event' : 'New event'}
        </h3>
      </header>
    );
  }

  render = () => {
    const saveCaption = (this.state.event.id ? 'Save event' : 'Create event');
    let cancelLink = null;
    if (this.props.cancelPath) {
      cancelLink = <Link to={this.props.cancelPath} className="btn btn-link">Cancel</Link>;
    }

    const categoryOptions = this.props.convention.event_categories
      .map(category => (
        <option value={category.id} key={category.id}>{humanize(category.name)}</option>
      ));

    return (
      <form className="my-4">
        {this.renderHeader()}

        {
          this.props.showCategorySelect
            ? (
              <BootstrapFormSelect
                label="Category"
                name="cagegory"
                value={this.state.event.event_category.id}
                onChange={
                  event => this.eventChanged({
                    ...this.state.event,
                    event_category: { id: Number.parseInt(event.target.value, 10) },
                  })
                }
              >
                {categoryOptions}
              </BootstrapFormSelect>
            )
            : null
        }

        <CommonEventFormFields
          event={this.state.event}
          onChange={this.eventChanged}
          ticketName={this.props.ticketName}
          canOverrideMaximumEventProvidedTickets={this.props.canOverrideMaximumEventProvidedTickets}
          createMaximumEventProvidedTicketsOverride={
            this.props.createMaximumEventProvidedTicketsOverride
          }
          deleteMaximumEventProvidedTicketsOverride={
            this.props.deleteMaximumEventProvidedTicketsOverride
          }
          updateMaximumEventProvidedTicketsOverride={
            this.props.updateMaximumEventProvidedTicketsOverride
          }
          ticketTypes={this.props.ticketTypes}
          form={this.props.form}
          convention={this.props.convention}
        >
          <ErrorDisplay stringError={this.state.error || this.props.error} />

          <ItemInteractionTracker.Interactor>
            {({ interactWithItem }) => (
              <button
                type="button"
                className="btn btn-primary mt-4"
                disabled={this.props.disabled}
                onClick={event => this.saveClicked(event, interactWithItem)}
              >
                {saveCaption}
              </button>
            )}
          </ItemInteractionTracker.Interactor>
          {cancelLink}
        </CommonEventFormFields>

        <ConfirmModal
          visible={this.state.droppingEvent}
          onCancel={this.cancelDrop}
          onOK={this.confirmDrop}
        >
          Are you sure you want to drop
          {' '}
          {this.state.event.title}
          ?  Doing so will
          also delete any runs of this event and remove any participants signed up
          for those runs.
        </ConfirmModal>
      </form>
    );
  }
}

export default EventForm;
