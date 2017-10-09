import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CommonEventFormFields from './CommonEventFormFields';
import RunFormFields from './RunFormFields';

class FillerEventForm extends React.Component {
  static propTypes = {
    initialEvent: PropTypes.shape({
      id: PropTypes.number,
      runs: PropTypes.arrayOf({
        id: PropTypes.number,
      }),
    }).isRequired,
    convention: RunFormFields.propTypes.convention.isRequired,
    cancelPath: PropTypes.string,
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

        <button className="btn btn-primary">{saveCaption}</button>
        {cancelLink}
      </form>
    );
  }
}

export default FillerEventForm;
