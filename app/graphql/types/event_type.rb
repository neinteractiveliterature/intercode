class Types::EventType < Types::BaseObject
  include FormResponseAttrsFields

  authorize_record

  field :id, Integer, null: false

  field :title, String, null: true
  field :author, String, null: true
  field :email, String, null: true
  field :organization, String, null: true
  field :url, String, null: true
  field :participant_communications, String, null: true
  field :age_restrictions, String, null: true
  field :content_warnings, String, null: true
  field :length_seconds, Integer, null: false
  field :can_play_concurrently, Boolean, null: false
  field :con_mail_destination, String, null: true
  field :description, String, null: true
  field :short_blurb, String, null: true
  field :status, String, null: true
  field :private_signup_list, Boolean, null: true
  field :form, Types::FormType, null: true
  field :created_at, Types::DateType, null: true

  field :event_category, Types::EventCategoryType, null: false

  association_loaders Event, :event_category, :team_members

  def form
    AssociationLoader.for(Event, :event_category).load(object).then do |event_category|
      AssociationLoader.for(EventCategory, :event_form).load(event_category)
    end
  end

  field :runs, [Types::RunType], null: false do
    argument :start, Types::DateType, required: false
    argument :finish, Types::DateType, required: false
    argument :exclude_conflicts, Boolean, required: false
  end

  def runs(**args)
    EventRunsLoader.for(args[:start], args[:finish], args[:exclude_conflicts], pundit_user)
      .load(object)
  end

  field :run, Types::RunType, null: false do
    argument :id, Integer, required: true
  end

  def run(**args)
    RecordLoader.for(Run).load(args[:id])
  end

  field :team_members, [Types::TeamMemberType], null: false

  def team_members
    EventTeamMembersLoader.for(pundit_user).load(object).then do |team_members|
      if context[:query_from_liquid]
        team_members.select(&:display?)
      else
        team_members
      end
    end
  end

  field :provided_tickets, [Types::TicketType], null: false do
    authorize do |value, _args, context|
      Pundit.policy(
        context[:pundit_user],
        Ticket.new(
          user_con_profile: UserConProfile.new(convention: context[:convention]),
          provided_by_event: value
        )
      ).read?
    end
  end
  field :can_provide_tickets, Boolean,
    deprecation_reason: 'Please use event_category.can_provide_tickets instead', null: false

  def can_provide_tickets
    object.event_category.can_provide_tickets?
  end

  override_type = Types::MaximumEventProvidedTicketsOverrideType
  field :maximum_event_provided_tickets_overrides, [override_type], null: false

  def maximum_event_provided_tickets_overrides
    loader = AssociationLoader.for(Event, :maximum_event_provided_tickets_overrides)
    loader.load(object).then do |meptos|
      meptos.select { |mepto| policy(mepto).read? }
    end
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
    MarkdownLoader.for('event', 'No information provided')
      .load([[object, 'short_blurb_html'], object.short_blurb])
  end

  field :description_html, String, null: true

  def description_html
    MarkdownLoader.for('event', 'No information provided')
      .load([[object, 'description_html'], object.description])
  end

  field :admin_notes, String, null: true do
    authorize_action :read_admin_notes
  end

  field :my_rating, Integer, null: true
  def my_rating
    return nil unless user_con_profile
    return nil unless EventRatingPolicy.new(
      pundit_user,
      EventRating.new(user_con_profile: user_con_profile, event: object)
    ).read?

    EventRatingLoader.for(user_con_profile).load(object)
  end

  field :form_response_changes, [Types::FormResponseChangeType], null: false do
    authorize_action :update
  end
  def form_response_changes
    AssociationLoader.for(Event, :form_response_changes).load(object).then do |changes|
      CompactingFormResponseChangesPresenter.new(changes).compacted_changes
    end
  end

  field :category, String, deprecation_reason: 'Please use event_category instead', null: false

  def category
    event_category.then { |category| category.name.underscore }
  end

  field :team_member_name, String,
    deprecation_reason: 'Please use event_category.team_member_name instead', null: false

  def team_member_name
    event_category.then(&:team_member_name)
  end
end
