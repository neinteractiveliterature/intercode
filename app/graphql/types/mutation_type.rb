def guard_for_convention_associated_model(association, action)
  ->(_obj, args, ctx) {
    event = ctx[:convention].public_send(association).find(args[:id])
    ctx[:current_ability].can?(action, event)
  }
end

GUARD_FOR_CREATE_EVENT = ->(_obj, args, ctx) {
  ctx[:current_ability].can?(:create, ctx[:convention].events.new(args[:event].to_h))
}

Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

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

  field :updateEvent, Mutations::UpdateEvent.field do
    guard(guard_for_convention_associated_model(:events, :update))
  end

  field :createRun, Mutations::CreateRun.field do
    guard ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:create, event.runs.new(args[:run].to_h))
    }
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
    guard(guard_for_convention_associated_model(:runs, :delete))
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
    guard(guard_for_convention_associated_model(:rooms, :delete))
  end
end
