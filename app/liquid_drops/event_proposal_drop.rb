# An event proposal which, if accepted, has an event associated with it
class EventProposalDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :event_proposal

  # @!method id
  #   @return [Integer] The numeric database ID of this event proposal
  # @!method owner
  #   @return [UserConProfileDrop] The profile of the person who submitted this event proposal
  # @!method event
  #   @return [EventDrop] The event created from this proposal, if this proposal has been accepted
  # @!method status
  #   @return [String] The status of this proposal (e.g. proposed, accepted, rejected, withdrawn)
  # @!method title
  #   @return [String] The title of the proposed event
  # @!method email
  #   @return [String] The contact email for the proposed event
  # @!method length_seconds
  #   @return [Integer] The length of the proposed event, in seconds
  # @!method description
  #   @return [String] The description of the proposed event
  # @!method short_blurb
  #   @return [String] The short blurb for the proposed event
  # @!method can_play_concurrently
  #   @return [Boolean] Whether or not the proposed event allows attendees to sign up for it
  #                     along with other events happening at the same time
  # @!method additional_info
  #   @return [String] Additional information the proposer wanted to provide
  # @!method created_at
  #   @return [DateTime] When the proposal was first started
  # @!method updated_at
  #   @return [DateTime] When the proposal was last modified
  delegate :id,
    :owner,
    :event,
    :status,
    :title,
    :email,
    :length_seconds,
    :description,
    :short_blurb,
    :can_play_concurrently,
    :additional_info,
    :created_at,
    :updated_at,
    to: :event_proposal

  # @api
  def initialize(event_proposal)
    @event_proposal = event_proposal
  end

  # @return [String] The relative URL for linking to edit the proposal
  def edit_url
    "/event_proposals/#{event_proposal.id}/edit"
  end

  # @return [String] The relative URL for linking admins to view the proposal
  def admin_url
    "/admin_event_proposals/#{event_proposal.id}"
  end
end
