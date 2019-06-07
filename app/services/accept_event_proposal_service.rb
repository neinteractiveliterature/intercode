class AcceptEventProposalService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :event
  end
  self.result_class = Result

  EVENT_ATTRIBUTE_MAP = {
    title: 'title',
    author: 'authors',
    email: 'email',
    event_email: 'event_email',
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

  attr_reader :event_proposal, :event_category

  def initialize(event_proposal:, event_category: nil)
    @event_proposal = event_proposal
    @event_category = event_category || event_proposal.event_category
  end

  private

  def inner_call
    event = convention.events.new(event_category: event_category, status: 'active')
    event.assign_default_values_from_form_items(event_form.form_items)
    event.assign_form_response_attributes(event_attributes)
    event.con_mail_destination ||= 'gms'
    event.save!
    event_proposal.update!(event: event)

    if event_proposal.owner
      event.team_members.create!(
        display: true,
        show_email: false,
        receive_con_email: true,
        receive_signup_email: 'non_waitlist_signups',
        user_con_profile: event_proposal.owner
      )
    end

    success(event: event)
  end

  def event_attributes
    @event_attributes ||= begin
      event_attributes = event_form_item_identifiers.each_with_object({}) do |event_attr, hash|
        proposal_attr = EVENT_ATTRIBUTE_MAP[event_attr.to_sym] || event_attr.to_s
        next unless proposal_form_item_identifiers.include?(proposal_attr)
        hash[event_attr] = event_proposal.read_form_response_attribute(proposal_attr)
      end

      event_attributes.merge(
        admin_notes: event_proposal.admin_notes
      )
    end
  end

  def event_form
    @event_form ||= event_category.event_form
  end

  def event_proposal_form
    @event_proposal_form ||= event_proposal.event_category.event_proposal_form
  end

  def event_form_item_identifiers
    @event_form_item_identifiers ||= event_form.form_items.pluck(:identifier)
  end

  def proposal_form_item_identifiers
    @proposal_form_item_identifiers ||= event_proposal_form.form_items.pluck(:identifier)
  end

  def convention
    @convention ||= event_proposal.convention
  end
end
