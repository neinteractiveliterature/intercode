class AcceptEventProposalService < CivilService::Service
  class Result < CivilService::Result
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
    participant_communications: 'player_communications',
    age_restrictions: 'age_restrictions',
    content_warnings: 'content_warnings'
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
    event = convention.events.create!(event_attributes)
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

  def event_attributes
    @event_attributes ||= begin
      event_attributes = EVENT_ATTRIBUTE_MAP.each_with_object({}) do |(event_attr, form_attr), hash|
        next unless form_item_identifiers.include?(form_attr)
        hash[event_attr] = event_proposal.read_form_response_attribute(form_attr)
      end

      event_attributes[:con_mail_destination] ||= (event_attributes[:email] ? 'event_email' : 'gms')

      DEFAULT_EVENT_ATTRIBUTES.merge(event_attributes).merge(
        admin_notes: event_proposal.admin_notes
      )
    end
  end

  def form
    @form ||= convention.regular_event_form
  end

  def form_item_identifiers
    @form_item_identifiers ||= form.form_items.pluck(:identifier)
  end

  def convention
    @convention ||= event_proposal.convention
  end
end
