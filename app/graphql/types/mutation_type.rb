def guard_for_event(action)
  ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:id])
    ctx[:current_ability].can?(action, event)
  }
end

GUARD_FOR_CREATE_EVENT = ->(_obj, args, ctx) {
  ctx[:current_ability].can?(:create, ctx[:convention].events.new(args[:event].to_h))
}

def guard_for_run(action)
  ->(_obj, args, ctx) {
    run = ctx[:convention].runs.find(args[:id])
    ctx[:current_ability].can?(action, run)
  }
end

Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createEvent, Mutations::CreateEvent.field do
    guard(GUARD_FOR_CREATE_EVENT)
  end

  field :createFillerEvent, Mutations::CreateFillerEvent.field do
    guard(GUARD_FOR_CREATE_EVENT)
  end

  field :dropEvent, Mutations::DropEvent.field do
    guard(guard_for_event(:drop))
  end

  field :updateEvent, Mutations::UpdateEvent.field do
    guard(guard_for_event(:update))
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
    guard(guard_for_run(:delete))
  end

  field :updateRun, Mutations::UpdateRun.field do
    guard(guard_for_run(:update))
  end
end
