Types::AbilityType = GraphQL::ObjectType.define do
  name 'Ability'

  field :can_override_maximum_event_provided_tickets, !types.Boolean do
    resolve -> (obj, _args, ctx) {
      override = TicketType.new(convention: ctx[:convention])
        .maximum_event_provided_tickets_overrides
        .new
      obj.can?(:create, override)
    }
  end

  field :can_update_signup, !types.Boolean do
    argument :signup_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Signup).load([obj, :update, args[:signup_id]])
    end
  end

  field :can_update_event, !types.Boolean do
    argument :event_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Event).load([obj, :update, args[:event_id]])
    end
  end

  field :can_delete_event, !types.Boolean do
    argument :event_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Event).load([obj, :destroy, args[:event_id]])
    end
  end

  field :can_create_tickets, !types.Boolean do
    resolve -> (obj, _args, ctx) do
      obj.can?(:create, Ticket.new(user_con_profile: UserConProfile.new(convention: ctx[:convention])))
    end
  end

  field :can_update_ticket, !types.Boolean do
    argument :ticket_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Ticket).load([obj, :update, args[:ticket_id]])
    end
  end

  field :can_delete_ticket, !types.Boolean do
    argument :ticket_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Ticket).load([obj, :destroy, args[:ticket_id]])
    end
  end

  field :can_read_signups, !types.Boolean do
    resolve -> (obj, _args, ctx) do
      obj.can?(:read, Signup.new(run: Run.new(event: Event.new(convention: ctx[:convention]))))
    end
  end

  field :can_create_user_con_profiles, !types.Boolean do
    resolve -> (obj, _args, ctx) do
      obj.can?(:create, UserConProfile.new(convention: ctx[:convention]))
    end
  end

  field :can_update_user_con_profile, !types.Boolean do
    argument :user_con_profile_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(UserConProfile).load([obj, :update, args[:user_con_profile_id]])
    end
  end

  field :can_delete_user_con_profile, !types.Boolean do
    argument :user_con_profile_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(UserConProfile).load([obj, :destroy, args[:user_con_profile_id]])
    end
  end

  field :can_become_user_con_profile, !types.Boolean do
    argument :user_con_profile_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(UserConProfile).load([obj, :become, args[:user_con_profile_id]])
    end
  end
end
