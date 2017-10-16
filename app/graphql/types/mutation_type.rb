Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createVolunteerEvent, Mutations::CreateVolunteerEvent.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(:create, ctx[:convention].events.new(category: 'volunteer_event'))
    }
  end

  field :createEvent, Mutations::CreateEvent.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(:create, ctx[:convention].events.new(args[:event].to_h))
    }
  end

  field :createFillerEvent, Mutations::CreateFillerEvent.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(:create, ctx[:convention].events.new(args[:event].to_h))
    }
  end

  field :dropEvent, Mutations::DropEvent.field do
    guard ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:id])
      ctx[:current_ability].can?(:drop, event)
    }
  end

  field :updateEvent, Mutations::UpdateEvent.field do
    guard ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:id])
      ctx[:current_ability].can?(:update, event)
    }
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
    guard ->(_obj, args, ctx) {
      run = ctx[:convention].runs.find(args[:id])
      ctx[:current_ability].can?(:delete, run)
    }
  end

  field :updateRun, Mutations::UpdateRun.field do
    guard ->(_obj, args, ctx) {
      run = ctx[:convention].runs.find(args[:id])
      ctx[:current_ability].can?(:update, run)
    }
  end
end
