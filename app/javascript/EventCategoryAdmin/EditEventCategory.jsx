import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import buildEventCategoryInput from './buildEventCategoryInput';
import EventCategoryForm from './EventCategoryForm';
import ErrorDisplay from '../ErrorDisplay';
import { UpdateEventCategory } from './mutations.gql';

class EditEventCategory extends React.Component {
  static propTypes = {
    initialEventCategory: PropTypes.shape({}).isRequired,
    forms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    ticketName: PropTypes.string.isRequired,
    ticketMode: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      eventCategory: props.initialEventCategory,
      mutationInProgress: false,
    };
  }

  render = () => (
    <>
      <h1 className="mb-4">Edit event category</h1>

      <EventCategoryForm
        value={this.state.eventCategory}
        onChange={(eventCategory) => { this.setState({ eventCategory }); }}
        forms={this.props.forms}
        ticketName={this.props.ticketName}
        ticketMode={this.props.ticketMode}
        disabled={this.state.mutationInProgress}
      />

      <ErrorDisplay graphQLError={this.state.error} />

      <Mutation mutation={UpdateEventCategory}>
        {mutate => (
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              this.setState({ mutationInProgress: true, error: null });
              try {
                await mutate({
                  variables: {
                    id: this.state.eventCategory.id,
                    eventCategory: buildEventCategoryInput(this.state.eventCategory),
                  },
                });

                this.props.history.push('/event_categories');
              } catch (error) {
                this.setState({ mutationInProgress: false, error });
              }
            }}
            disabled={this.state.mutationInProgress}
          >
            Save changes
          </button>
        )}
      </Mutation>
    </>
  )
}

export default withRouter(EditEventCategory);
