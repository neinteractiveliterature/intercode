class Types::EventType < Types::BaseObject
  field :id, Integer, null: false

  field :title, String, null: true
  field :author, String, null: true
  field :email, String, null: true
  field :organization, String, null: true
  field :category, String, null: true
  field :url, String, null: true
  field :participant_communications, String, null: true
  field :age_restrictions, String, null: true
  field :content_warnings, String, null: true
  field :length_seconds, Integer, null: true
  field :can_play_concurrently, Boolean, null: true
  field :con_mail_destination, String, null: true
  field :description, String, null: true
  field :short_blurb, String, null: true
  field :status, String, null: true

  field :runs, [Types::RunType],
    null: false,
    guard: -> (event, _args, ctx) do
      ctx[:current_ability].can?(:read, Run.new(event: event))
    end
  def runs
    AssociationLoader.for(Event, :runs).load(@object)
  end

  field :team_members, [Types::TeamMemberType], null: false
  def team_members
    AssociationLoader.for(Event, :team_members).load(@object)
  end

  field :team_member_name, String, null: false
  field :provided_tickets, [Types::TicketType],
    null: false,
    guard: -> (event, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Ticket.new(
          user_con_profile: UserConProfile.new(convention: ctx[:convention]),
          provided_by_event: event
        )
      )
    end

  field :can_provide_tickets, Boolean, null: false, property: :can_provide_tickets?
  field :maximum_event_provided_tickets_overrides, [Types::MaximumEventProvidedTicketsOverrideType],
    null: false
  def maximum_event_provided_tickets_overrides
    AssociationLoader.for(Event, :maximum_event_provided_tickets_overrides).load(@object)
  end

  field :registration_policy, Types::RegistrationPolicyType

  field :slots_limited, Boolean, null: false
  def slots_limited
    @object.registration_policy.slots_limited?
  end

  field :total_slots, Integer, null: true
  def total_slots
    @object.registration_policy.total_slots
  end

  field :short_blurb_html, String, null: true
  def short_blurb_html
    MarkdownPresenter.new('No blurb provided').render @object.short_blurb
  end

  field :description_html, String, null: true
  def description_html
    MarkdownPresenter.new('No description provided').render @object.description
  end

  field :event_page_url, String, null: false
  def event_page_url
    Rails.application.routes.url_helpers.event_path(@object)
  end

  field :form_response_attrs_json, String, null: false
  def form_response_attrs_json
    FormResponsePresenter.new(
      @context[:convention].form_for_event_category(@object.category),
      @object
    ).as_json.to_json
  end
end
