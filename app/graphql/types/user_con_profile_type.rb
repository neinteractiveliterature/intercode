class Types::UserConProfileType < Types::BaseObject
  def self.personal_info_field(*args, **kwargs, &block)
    field(*args, **kwargs) do
      guard ->(user_con_profile, _args, ctx) do
        ctx[:current_ability].can?(:read_personal_info, user_con_profile)
      end
      instance_eval(&block) if block
    end
  end

  field :id, Integer, null: false
  field :convention, Types::ConventionType, null: true
  field :privileges, [String, null: true], null: true

  def privileges
    AssociationLoader.for(UserConProfile, :user).load(object).then do |user|
      user.privileges + object.user_con_profile_privileges
    end
  end
  field :name, String, null: true
  field :name_without_nickname, String, null: true
  field :name_inverted, String, null: true
  field :first_name, String, null: true
  field :last_name, String, null: true
  field :nickname, String, null: true
  field :bio, String, null: true
  field :show_nickname_in_bio, Boolean, null: true
  field :form_response_attrs_json, String, null: true

  def form_response_attrs_json
    FormResponsePresenter.new(context[:convention].user_con_profile_form, object).as_json.to_json
  end

  personal_info_field :user, Types::UserType, null: true
  personal_info_field :email, String, null: true

  association_loaders UserConProfile, :user, :orders, :signups, :team_members

  def email
    AssociationLoader.for(UserConProfile, :user).load(object).then(&:email)
  end

  personal_info_field :birth_date, Types::DateType, null: true
  personal_info_field :address, String, null: true
  personal_info_field :city, String, null: true
  personal_info_field :state, String, null: true
  personal_info_field :zipcode, String, null: true
  personal_info_field :country, String, null: true
  personal_info_field :day_phone, String, null: true
  personal_info_field :evening_phone, String, null: true
  personal_info_field :best_call_time, String, null: true
  personal_info_field :preferred_contact, String, null: true

  field :ticket, Types::TicketType, null: true do
    guard -> (ticket, _args, ctx) {
      ctx[:current_ability].can?(:read, ticket)
    }
  end

  def ticket
    current_ability.can?(:read, object)
  end

  field :ability, Types::AbilityType, null: true

  def ability
    if object == context[:user_con_profile]
      current_ability
    else
      AbilityLoader.for(UserConProfile).load(object)
    end
  end

  field :orders, [Types::OrderType, null: true], null: false do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, Order.new(user_con_profile: obj))
    }
  end

  field :order_summary, String, null: false do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, Order.new(user_con_profile: obj))
    }
  end

  def order_summary
    OrderSummaryLoader.for().load(object)
  end

  field :signups, [Types::SignupType], null: false do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, Signup.new(user_con_profile: obj, run: obj.convention.events.new.runs.new))
    }
  end

  field :team_members, [Types::TeamMemberType], null: false do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, TeamMember.new(user_con_profile: obj, event: obj.convention.events.new))
    }
  end

  field :can_override_maximum_event_provided_tickets, Boolean, null: false

  def can_override_maximum_event_provided_tickets
    ability = if object == context[:user_con_profile]
      current_ability
    else
      Ability.new(object.user)
    end

    override = context[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
    ability.can?(:create, override)
  end
end
