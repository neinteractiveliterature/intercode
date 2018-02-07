def guard_for_convention_associated_model(association, action)
  ->(_obj, args, ctx) {
    model = ctx[:convention].public_send(association).find(args[:id])
    ctx[:current_ability].can?(action, model)
  }
end

def guard_for_create_event_associated_model(association, arg_name)
  guard ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])
    model = event.public_send(association).new(args[arg_name].to_h)
    ctx[:current_ability].can?(:create, model)
  }
end

def guard_for_model_with_id(model_class, action)
  guard ->(_obj, args, ctx) {
    ctx[:current_ability].can?(action, model_class.find(args[:id]))
  }
end

GUARD_FOR_CREATE_EVENT = ->(_obj, args, ctx) {
  ctx[:current_ability].can?(:create, ctx[:convention].events.new(args[:event].to_h))
}

Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  field :updateConvention, Mutations::UpdateConvention.field do
    guard ->(_obj, args, ctx) {
      convention = args[:id] ? Convention.find(args[:id]) : ctx[:convention]
      ctx[:current_ability].can?(:update, convention)
    }
  end

  field :createEvent, Mutations::CreateEvent.field do
    guard(GUARD_FOR_CREATE_EVENT)
  end

  field :createFillerEvent, Mutations::CreateFillerEvent.field do
    guard(GUARD_FOR_CREATE_EVENT)
  end

  field :dropEvent, Mutations::DropEvent.field do
    guard(guard_for_convention_associated_model(:events, :drop))
  end

  field :restoreDroppedEvent, Mutations::RestoreDroppedEvent.field do
    guard(guard_for_convention_associated_model(:events, :restore))
  end

  field :updateEvent, Mutations::UpdateEvent.field do
    guard(guard_for_convention_associated_model(:events, :update))
  end

  field :createRun, Mutations::CreateRun.field do
    guard(guard_for_create_event_associated_model(:runs, :run))
  end

  field :createMultipleRuns, Mutations::CreateMultipleRuns.field do
    guard ->(_obj, args, ctx) {
      events = ctx[:convention].events.find(args[:runs].map { |run| run[:event_id] })
      events.all? do |event|
        ctx[:current_ability].can?(:create, event.runs.new(args))
      end
    }
  end

  field :deleteRun, Mutations::DeleteRun.field do
    guard(guard_for_convention_associated_model(:runs, :destroy))
  end

  field :updateRun, Mutations::UpdateRun.field do
    guard(guard_for_convention_associated_model(:runs, :update))
  end

  field :createRoom, Mutations::CreateRoom.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(:create, ctx[:convention].rooms.new(args[:room].to_h))
    }
  end

  field :updateRoom, Mutations::UpdateRoom.field do
    guard(guard_for_convention_associated_model(:rooms, :update))
  end

  field :deleteRoom, Mutations::DeleteRoom.field do
    guard(guard_for_convention_associated_model(:rooms, :destroy))
  end

  field :createTeamMember, Mutations::CreateTeamMember.field do
    guard(guard_for_create_event_associated_model(:team_members, :team_member))
  end

  field :deleteTeamMember, Mutations::DeleteTeamMember.field do
    guard(guard_for_model_with_id(TeamMember, :destroy))
  end

  field :updateTeamMember, Mutations::UpdateTeamMember.field do
    guard(guard_for_model_with_id(TeamMember, :update))
  end

  field :deletePage, Mutations::DeletePage.field do
    guard(guard_for_convention_associated_model(:pages, :destroy))
  end

  field :provideEventTicket, Mutations::ProvideEventTicket.field do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:update, event.team_members.new)
    }
  end

  create_override_field = Mutations::CreateMaximumEventProvidedTicketsOverride.field
  field :createMaximumEventProvidedTicketsOverride, create_override_field do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:create, event.maximum_event_provided_tickets_overrides.new)
    }
  end

  update_override_field = Mutations::UpdateMaximumEventProvidedTicketsOverride.field
  field :updateMaximumEventProvidedTicketsOverride, update_override_field do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :update))
  end

  delete_override_field = Mutations::DeleteMaximumEventProvidedTicketsOverride.field
  field :deleteMaximumEventProvidedTicketsOverride, delete_override_field do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :destroy))
  end

  field :updateFormWithJSON, Mutations::UpdateFormWithJSON.field do
    guard(guard_for_model_with_id(Form, :update))
  end
end
