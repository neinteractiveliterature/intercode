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
  field :birth_date, Types::DateType
  field :address, types.String
  field :city, types.String
  field :state, types.String
  field :zipcode, types.String
  field :country, types.String
  field :day_phone, types.String
  field :evening_phone, types.String
  field :best_call_time, types.String
  field :preferred_contact, types.String
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
