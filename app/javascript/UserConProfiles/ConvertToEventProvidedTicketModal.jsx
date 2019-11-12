import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';

import { ConvertTicketToEventProvided } from './mutations.gql';
import { ConvertToEventProvidedTicketQuery, UserConProfileAdminQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import EventSelect from '../BuiltInFormControls/EventSelect';
import ProvidableTicketTypeSelection from '../EventsApp/TeamMemberAdmin/ProvidableTicketTypeSelection';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import TicketingStatusDescription from '../EventsApp/TeamMemberAdmin/TicketingStatusDescription';

class ConvertToEventProvidedTicketModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: null,
      ticketTypeId: null,
      mutationInProgress: false,
      error: null,
    };
  }

  render = () => {
    const {
      convention, userConProfile, visible, onClose,
    } = this.props;

    return (
      <Modal visible={visible}>
        <div className="modal-header">
          {'Convert '}
          {userConProfile.name}
          {'\'s '}
          {convention.ticket_name}
          {' to event-provided'}
        </div>

        <div className="modal-body">
          <p>
            {'This will delete '}
            {userConProfile.name}
            &apos;s
            {' existing '}
            {convention.ticket_name}
            {' and create a new one for them, provided by an event.  If they paid for their existing '}
            {convention.ticket_name}
            {', that payment will be refunded.'}
          </p>

          <EventSelect
            value={this.state.event}
            onChange={(value) => { this.setState({ event: value, ticketTypeId: null }); }}
            placeholder="Select event..."
            disabled={this.state.mutationInProgress}
          />

          {
            this.state.event
              ? (
                <QueryWithStateDisplay
                  query={ConvertToEventProvidedTicketQuery}
                  variables={{ eventId: this.state.event.id }}
                >
                  {({ data }) => (
                    <>
                      <p className="mt-4">
                        <TicketingStatusDescription
                          userConProfile={userConProfile}
                          convention={convention}
                        />
                      </p>

                      <ProvidableTicketTypeSelection
                        event={data.event}
                        convention={data.convention}
                        value={this.state.ticketTypeId}
                        onChange={(value) => { this.setState({ ticketTypeId: value }); }}
                        disabled={this.state.mutationInProgress}
                      />
                    </>
                  )}
                </QueryWithStateDisplay>
              )
              : null
          }

          <ErrorDisplay graphQLError={this.state.error} />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={this.state.mutationInProgress}
          >
            Cancel
          </button>
          <Mutation mutation={ConvertTicketToEventProvided}>
            {(mutate) => (
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  this.state.mutationInProgress || !this.state.event || !this.state.ticketTypeId
                }
                onClick={async () => {
                  this.setState({ mutationInProgress: true });
                  try {
                    await mutate({
                      variables: {
                        eventId: this.state.event.id,
                        ticketTypeId: this.state.ticketTypeId,
                        userConProfileId: userConProfile.id,
                      },
                      update: (cache, { data: { convertTicketToEventProvided: { ticket } } }) => {
                        const cachedData = cache.readQuery({
                          query: UserConProfileAdminQuery,
                          variables: { id: userConProfile.id },
                        });

                        cache.writeQuery({
                          query: UserConProfileAdminQuery,
                          variables: { id: userConProfile.id },
                          data: {
                            ...cachedData,
                            userConProfile: {
                              ...cachedData.userConProfile,
                              ticket,
                            },
                          },
                        });
                      },
                    });
                    this.setState({ mutationInProgress: false });
                    onClose();
                  } catch (error) {
                    this.setState({ error, mutationInProgress: false });
                  }
                }}
              >
                {'Convert '}
                {convention.ticket_name}
              </button>
            )}
          </Mutation>
        </div>
      </Modal>
    );
  }
}

ConvertToEventProvidedTicketModal.propTypes = {
  convention: PropTypes.shape({
    ticket_name: PropTypes.string.isRequired,
  }).isRequired,
  userConProfile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConvertToEventProvidedTicketModal;
