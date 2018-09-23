import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { Mutation } from 'react-apollo';

import { componentLocalStateUpdater, combineStateChangeCalculators, Transforms } from '../ComposableFormUtils';
import ErrorDisplay from '../ErrorDisplay';
import { transitionEventProposalMutation } from './mutations';

class EventProposalStatusUpdater extends React.Component {
  static propTypes = {
    eventProposalId: PropTypes.number.isRequired,
    initialStatus: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      status: props.initialStatus,
      mutating: false,
      error: null,
    };

    this.stateUpdater = componentLocalStateUpdater(
      this,
      combineStateChangeCalculators({
        status: Transforms.inputChange(Transforms.identity),
      }),
    );

    enableUniqueIds(this);
  }

  render = () => {
    const selectId = this.nextUniqueId();

    return (
      <div className="form form-inline">
        <label htmlFor={selectId}>
          Status:
          <select
            id={selectId}
            className="form-control-sm ml-1 mr-2"
            value={this.state.status}
            onChange={this.stateUpdater.status}
            disabled={this.state.mutating}
          >
            {
              ['proposed', 'reviewing', 'accepted', 'rejected', 'withdrawn'].map(status => (
                <option value={status} key={status}>{status}</option>
              ))
            }
          </select>
        </label>
        <Mutation mutation={transitionEventProposalMutation}>
          {mutate => (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={this.state.mutating}
              onClick={async () => {
                this.setState({ mutating: true });

                try {
                  const { eventProposalId } = this.props;
                  const { status } = this.state;
                  await mutate({ variables: { eventProposalId, status } });
                  this.setState({ mutating: false });
                } catch (error) {
                  this.setState({ mutating: false, error });
                }
              }}
            >
              Update
            </button>
          )}
        </Mutation>
        <ErrorDisplay graphQLError={this.state.error} />
      </div>
    );
  }
}

export default EventProposalStatusUpdater;
