CAN_UPDATE_USER_CON_PROFILE_GUARD = ->(user_con_profile, _args, ctx) do
  ctx[:current_ability].can?(:update, user_con_profile)
end

Types::UserConProfileType = GraphQL::ObjectType.define do
  name 'UserConProfile'

  field :id, !types.Int
  field :convention, Types::ConventionType
  field :privileges, types[types.String]
  field :name, types.String
  field :name_without_nickname, types.String
  field :first_name, types.String
  field :last_name, types.String
  field :nickname, types.String
  field :bio, types.String
  field :show_nickname_in_bio, types.Boolean
  field(:birth_date, Types::DateType) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:address, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:city, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:state, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:zipcode, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:country, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:day_phone, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:evening_phone, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:best_call_time, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field(:preferred_contact, types.String) { guard CAN_UPDATE_USER_CON_PROFILE_GUARD }
  field :ticket, Types::TicketType do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(UserConProfile, :ticket).load(obj)
    }
  end

  field :ability, Types::AbilityType do
    resolve -> (obj, _args, ctx) {
      if obj == ctx[:current_user_con_profile]
        ctx[:current_ability]
      else
        AbilityLoader.for(UserConProfile).load(obj)
      end
    }
  end

  field :can_override_maximum_event_provided_tickets, !types.Boolean do
    resolve -> (obj, _args, ctx) {
      ability = if obj == ctx[:current_user_con_profile]
        ctx[:current_ability]
      else
        Ability.new(obj.user)
      end

      override = ctx[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
      ability.can?(:create, override)
    }
  end
end
