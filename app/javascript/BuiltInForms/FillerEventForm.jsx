import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CommonEventFormFields from './CommonEventFormFields';
import RunFormFields from './RunFormFields';

class FillerEventForm extends React.Component {
  static propTypes = {
    initialEvent: PropTypes.shape({
      id: PropTypes.number,
      runs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
      })),
    }).isRequired,

    // The convention prop type we're using is already required
    // eslint-disable-next-line react/require-default-props
    convention: RunFormFields.propTypes.convention,
    cancelPath: PropTypes.string,
    onSave: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cancelPath: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: props.initialEvent,
      run: props.initialEvent.runs[0] || {},
    };
  }

  eventFieldChanged = (eventData) => {
    this.setState({ event: { ...this.state.event, ...eventData } });
  }

  runChanged = (runData) => {
    this.setState({ run: { ...this.state.run, ...runData } });
  }

  saveClicked = (event) => {
    event.preventDefault();
    this.props.onSave({ event: this.state.event, run: this.state.run });
  }

  render = () => {
    const saveCaption = (this.state.event.id ? 'Save filler event' : 'Create filler event');
    let cancelLink = null;
    if (this.props.cancelPath) {
      cancelLink = <Link to={this.props.cancelPath} className="btn btn-link">Cancel</Link>;
    }

    return (
      <form className="my-4">
        <h3 className="mb-4">
          {this.state.event.id ? 'Edit filler event' : 'New filler event'}
        </h3>

        <CommonEventFormFields
          event={this.state.event}
          onChange={this.eventFieldChanged}
        />

        <RunFormFields
          run={this.state.run}
          event={this.state.event}
          convention={this.props.convention}
          onChange={this.runChanged}
        />

        <button className="btn btn-primary" onClick={this.saveClicked}>{saveCaption}</button>
        {cancelLink}
      </form>
    );
  }
}

export default FillerEventForm;
