import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import EventProposalDisplay from './EventProposalDisplay';
import EventProposalStatusUpdater from './EventProposalStatusUpdater';
import { eventProposalQueryWithOwner } from './queries';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

class EventProposalAdminDisplay extends React.PureComponent {
  static propTypes = {
    eventProposalId: PropTypes.number.isRequired,
  }

  render = () => (
    <QueryWithStateDisplay
      query={eventProposalQueryWithOwner}
      variables={{ eventProposalId: this.props.eventProposalId }}
    >
      {({ data }) => (
        <React.Fragment>
          <div className="d-flex justify-space-between align-items-baseline">
            <div className="col">
              <h1>{data.eventProposal.title}</h1>
            </div>

            {
              data.myProfile.ability.can_update_event_proposal
                ? (
                  <EventProposalStatusUpdater
                    eventProposalId={this.props.eventProposalId}
                    initialStatus={data.eventProposal.status}
                  />
                )
                : (
                  <div>
                    <strong>Status: </strong>
                    {data.eventProposal.status}
                  </div>
                )
            }
          </div>

          <div className="my-4">
            {
              data.eventProposal.event
                ? (
                  <a href={`/events/${data.eventProposal.event.id}`} className="btn btn-outline-primary">
                    Go to event
                  </a>
                )
                : (
                  <Link
                    to={`/${this.props.eventProposalId}/edit`}
                    className="btn btn-outline-primary"
                  >
                    Edit proposal
                  </Link>
                )
            }
          </div>

          <EventProposalDisplay eventProposalId={this.props.eventProposalId} />
        </React.Fragment>
      )}
    </QueryWithStateDisplay>
  )

  // .d-flex.justify-space-between.align-items-baseline
  //   .col
  //     %h1= @admin_event_proposal.title
  //   - if can? :update, @admin_event_proposal
  //     %div
  //       = bootstrap_form_for @admin_event_proposal, url: admin_event_proposal_path(@admin_event_proposal), layout: :inline do |f|
  //         = f.select :status, ['proposed', 'reviewing', 'accepted', 'rejected', 'withdrawn'], { label: 'Status:' }, class: 'form-control-sm ml-1 mr-2'
  //         = f.submit "Update", class: 'btn btn-sm btn-primary'
  //   - else
  //     %div
  //       %strong Status:
  //       = @admin_event_proposal.status
  //
  // - if @admin_event_proposal.event
  //   .my-4
  //     = link_to "Go to event", @admin_event_proposal.event, class: 'btn btn-outline-primary'
  // - elsif can? :update, @admin_event_proposal
  //   .my-4
  //     = link_to "Edit proposal", edit_event_proposal_path(@admin_event_proposal, exit_caption: 'Return to proposal', exit_url: admin_event_proposal_path(@admin_event_proposal)), class: 'btn btn-outline-primary'
  //
  // = app_component 'EventProposalDisplay', eventProposalId: @admin_event_proposal.id
  //
}

export default EventProposalAdminDisplay;
