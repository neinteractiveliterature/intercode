import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import buildEventCategoryInput from './buildEventCategoryInput';
import { CreateEventCategory } from './mutations.gql';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryForm from './EventCategoryForm';
import ErrorDisplay from '../ErrorDisplay';

class NewEventCategory extends React.Component {
  static propTypes = {
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
      eventCategory: {
        name: '',
        team_member_name: 'team member',
        scheduling_ui: null,
        can_provide_tickets: false,
      },
      mutationInProgress: false,
    };
  }

  render = () => (
    <>
      <h1 className="mb-4">New event category</h1>

      <EventCategoryForm
        value={this.state.eventCategory}
        onChange={(eventCategory) => { this.setState({ eventCategory }); }}
        forms={this.props.forms}
        ticketName={this.props.ticketName}
        ticketMode={this.props.ticketMode}
        disabled={this.state.mutationInProgress}
      />

      <ErrorDisplay graphQLError={this.state.error} />

      <Mutation mutation={CreateEventCategory}>
        {mutate => (
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              this.setState({ mutationInProgress: true, error: null });
              try {
                await mutate({
                  variables: {
                    eventCategory: buildEventCategoryInput(this.state.eventCategory),
                  },
                  update: (
                    store,
                    { data: { createEventCategory: { event_category: eventCategory } } },
                  ) => {
                    const data = store.readQuery({ query: EventCategoryAdminQuery });
                    store.writeQuery({
                      query: EventCategoryAdminQuery,
                      data: {
                        ...data,
                        convention: {
                          ...data.convention,
                          event_categories: [
                            ...data.convention.event_categories,
                            eventCategory,
                          ],
                        },
                      },
                    });
                  },
                });

                this.props.history.push('/');
              } catch (error) {
                this.setState({ mutationInProgress: false, error });
              }
            }}
            disabled={this.state.mutationInProgress}
          >
            Create event category
          </button>
        )}
      </Mutation>
    </>
  )
}

export default withRouter(NewEventCategory);
