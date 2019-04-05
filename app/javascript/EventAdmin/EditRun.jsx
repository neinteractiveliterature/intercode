import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import EditRunModal from './EditRunModal';
import { ConventionFields, EventFields } from './queries.gql';

class EditRun extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
      params: PropTypes.shape({
        eventId: PropTypes.string.isRequired,
        runId: PropTypes.string.isRequired,
      }).isRequired,
    }),
    convention: propType(ConventionFields).isRequired,
    events: PropTypes.arrayOf(propType(EventFields)).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    match: null,
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { match } = nextProps;
    if (!match) {
      return { event: null, run: null };
    }

    if (
      prevState
      && prevState.run
      && prevState.run.id
      && match.params.runId === prevState.run.id.toString()
    ) {
      return null;
    }

    const event = nextProps.events.find(e => e.id.toString() === match.params.eventId);
    if (match.path === '/:eventId/runs/new') {
      const run = prevState.run || {
        starts_at: null,
        title_suffix: null,
        schedule_note: null,
        rooms: [],
      };
      return { event, run };
    }

    const run = event.runs.find(r => r.id.toString() === match.params.runId);
    return { event, run };
  }

  state = {
    event: null,
    run: null,
  };

  cancelEditing = () => {
    if (this.props.match.path === '/recurring_events/:eventId/runs/:runId/edit') {
      this.props.history.replace('/recurring_events');
    } else {
      this.props.history.replace('/runs');
    }
  }

  runChanged = (run) => { this.setState({ run }); }

  render = () => (
    <EditRunModal
      convention={this.props.convention}
      editingRunChanged={this.runChanged}
      event={this.state.event}
      onCancel={this.cancelEditing}
      onDelete={this.cancelEditing}
      onSaveStart={() => {}}
      onSaveSucceeded={this.cancelEditing}
      onSaveFailed={() => {}}
      run={this.state.run}
    />
  )
}

export default EditRun;
