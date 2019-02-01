CAN_READ_PERSONAL_INFO_GUARD = ->(user_con_profile, _args, ctx) do
  ctx[:current_ability].can?(:read_personal_info, user_con_profile)
end

Types::UserConProfileType = GraphQL::ObjectType.define do
  name 'UserConProfile'

  field :id, !types.Int
  field :convention, Types::ConventionType
  field :privileges, types[types.String] do
    resolve -> (obj, _args, _ctx) do
      AssociationLoader.for(UserConProfile, :user).load(obj).then do |user|
        user.privileges + obj.user_con_profile_privileges
      end
    end
  end
  field :name, types.String
  field :name_without_nickname, types.String
  field :name_inverted, types.String
  field :first_name, types.String
  field :last_name, types.String
  field :nickname, types.String
  field :bio, types.String
  field :show_nickname_in_bio, types.Boolean
  field :form_response_attrs_json, types.String do
    resolve -> (obj, _args, ctx) do
      FormResponsePresenter.new(ctx[:convention].user_con_profile_form, obj).as_json.to_json
    end
  end
  field :user, Types::UserType do
    guard CAN_READ_PERSONAL_INFO_GUARD
    resolve -> (obj, _args, _ctx) do
      AssociationLoader.for(UserConProfile, :user).load(obj)
    end
  end
  field(:email, types.String) do
    guard CAN_READ_PERSONAL_INFO_GUARD
    resolve -> (obj, _args, _ctx) do
      AssociationLoader.for(UserConProfile, :user).load(obj).then(&:email)
    end
  end
  field(:birth_date, Types::DateType) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:address, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:city, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:state, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:zipcode, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:country, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:day_phone, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:evening_phone, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:best_call_time, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field(:preferred_contact, types.String) { guard CAN_READ_PERSONAL_INFO_GUARD }
  field :ticket, Types::TicketType do
    guard -> (ticket, _args, ctx) {
      ctx[:current_ability].can?(:read, ticket)
    }
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(UserConProfile, :ticket).load(obj)
    }
  end

  field :ability, Types::AbilityType do
    resolve -> (obj, _args, ctx) {
      if obj == ctx[:user_con_profile]
        ctx[:current_ability]
      else
        AbilityLoader.for(UserConProfile).load(obj)
      end
    }
  end

  field :orders, !types[Types::OrderType] do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, Order.new(user_con_profile: obj))
    }
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(UserConProfile, :orders).load(obj)
    }
  end

  field :order_summary, !types.String do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, Order.new(user_con_profile: obj))
    }
    resolve -> (obj, _args, _ctx) {
      OrderSummaryLoader.for().load(obj)
    }
  end

  field :signups, Types::Signup.to_list_type.to_non_null_type do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, Signup.new(user_con_profile: obj, run: obj.convention.events.new.runs.new))
    }
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(UserConProfile, :signups).load(obj)
    }
  end

  field :team_members, Types::TeamMemberType.to_list_type.to_non_null_type do
    guard -> (obj, _args, ctx) {
      ctx[:current_ability].can?(:read, TeamMember.new(user_con_profile: obj, event: obj.convention.events.new))
    }
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(UserConProfile, :team_members).load(obj)
    }
  end

  field :can_override_maximum_event_provided_tickets, !types.Boolean do
    resolve -> (obj, _args, ctx) {
      ability = if obj == ctx[:user_con_profile]
        ctx[:current_ability]
      else
        Ability.new(obj.user)
      end

      override = ctx[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
      ability.can?(:create, override)
    }
  end
end
