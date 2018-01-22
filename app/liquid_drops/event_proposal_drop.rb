class EventProposalDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  attr_reader :event_proposal
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

  def initialize(event_proposal)
    @event_proposal = event_proposal
  end

  def edit_url
    edit_event_proposal_path(event_proposal)
  end
end
