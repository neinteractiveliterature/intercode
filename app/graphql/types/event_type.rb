class Types::EventType < Types::BaseObject
  field :id, Integer, null: false

  field :title, String, null: true
  field :author, String, null: true
  field :email, String, null: true
  field :organization, String, null: true
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
  field :private_signup_list, Boolean, null: true
  field :form, Types::FormType, null: true
  field :created_at, Types::DateType, null: true

  field :event_category, Types::EventCategoryType, null: false
  field :team_members, [Types::TeamMemberType], null: false

  association_loaders Event, :event_category, :team_members


  field :form_response_attrs_json, Types::Json, null: true

  def form_response_attrs_json
    AssociationLoader.for(Event, :event_category).load(object).then do |event_category|
      AssociationLoader.for(EventCategory, :event_form).load(event_category)
    end.then do |form|
      FormResponsePresenter.new(form, object).as_json
    end
  end

  field :form_response_attrs_json_with_rendered_markdown, Types::Json, null: true

  def form_response_attrs_json_with_rendered_markdown
    AssociationLoader.for(Event, :event_category).load(object).then do |event_category|
      AssociationLoader.for(EventCategory, :event_form).load(event_category)
    end.then do |form|
      FormResponsePresenter.new(form, object).as_json_with_rendered_markdown('event', object, '')
    end
  end

  field :runs, [Types::RunType], null: false do
    argument :start, Types::DateType, required: false
    argument :finish, Types::DateType, required: false
  end

  def runs(**args)
    EventRunsLoader.for(args[:start], args[:finish], context[:current_ability]).load(object)
  end

  field :run, Types::RunType, null: false do
    argument :id, Integer, required: true
    guard -> (event, args, ctx) do
      ctx[:current_ability].can?(:read, event.runs.find(args[:id]))
    end
  end

  def run(**args)
    context[:current_ability].can?(:read, object.runs.find(args[:id]))
  end

  field :provided_tickets, [Types::TicketType], null: false do
    guard -> (event, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Ticket.new(
          user_con_profile: UserConProfile.new(convention: ctx[:convention]),
          provided_by_event: event
        )
      )
    end
  end
  field :can_provide_tickets, Boolean, deprecation_reason: 'Plaese use event_category.can_provide_tickets instead', null: false

  def can_provide_tickets
    object.event_category.can_provide_tickets?
  end

  override_type = Types::MaximumEventProvidedTicketsOverrideType
  field :maximum_event_provided_tickets_overrides, [override_type], null: false

  def maximum_event_provided_tickets_overrides
    AssociationLoader.for(Event, :maximum_event_provided_tickets_overrides).load(object)
  end

  field :registration_policy, Types::RegistrationPolicyType, null: true

  field :slots_limited, Boolean, null: true

  def slots_limited
    object.registration_policy.slots_limited?
  end

  field :total_slots, Integer, null: true

  def total_slots
    object.registration_policy.total_slots
  end

  field :short_blurb_html, String, null: true

  def short_blurb_html
    MarkdownLoader.for('event', 'No information provided').load([[object, 'short_blurb_html'], object.short_blurb])
  end

  field :description_html, String, null: true

  def description_html
    MarkdownLoader.for('event', 'No information provided').load([[object, 'description_html'], object.description])
  end

  field :admin_notes, String, null: true do
    guard -> (obj, _args, ctx) do
      ctx[:current_ability].can?(:read_admin_notes, obj)
    end
  end

  field :category, String, deprecation_reason: 'Please use event_category instead', null: false

  def category
    object.event_category.name.underscore
  end

  field :team_member_name, String, deprecation_reason: 'Please use event_category.team_member_name instead', null: false

  def team_member_name
    object.event_category.team_member_name
  end
end
