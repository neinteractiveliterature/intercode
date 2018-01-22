class AcceptEventProposalService < ApplicationService
  class Result < ServiceResult
    attr_accessor :event
  end
  self.result_class = Result

  EVENT_ATTRIBUTE_MAP = {
    title: 'title',
    author: 'authors',
    email: 'email',
    organization: 'organization',
    url: 'url',
    length_seconds: 'length_seconds',
    can_play_concurrently: 'can_play_concurrently',
    description: 'description',
    short_blurb: 'short_blurb',
    registration_policy: 'registration_policy',
    participant_communications: 'player_communications'
  }

  DEFAULT_EVENT_ATTRIBUTES = {
    category: 'larp',
    status: 'active'
  }

  attr_reader :event_proposal

  def initialize(event_proposal:)
    @event_proposal = event_proposal
  end

  private

  def inner_call
    event_attributes = EVENT_ATTRIBUTE_MAP.each_with_object({}) do |(event_attribute, form_attribute), hash|
      hash[event_attribute] = event_proposal.read_form_response_attribute(form_attribute)
    end

    event_attributes[:con_mail_destination] ||= (event_attributes[:email] ? 'event_email' : 'gms')

    event = convention.events.create!(
      DEFAULT_EVENT_ATTRIBUTES.merge(event_attributes)
    )

    event_proposal.update!(event: event)

    if event_proposal.owner
      event.team_members.create!(
        display: true,
        show_email: false,
        receive_con_email: true,
        receive_signup_email: false,
        user_con_profile: event_proposal.owner
      )
    end

    success(event: event)
  end

  def convention
    @convention ||= event_proposal.convention
  end
end
