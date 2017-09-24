Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createRun, Mutations::CreateRun.field do
    guard ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:create, event.runs.new)
    }
  end
  field :createMultipleRuns, Mutations::CreateMultipleRuns.field do
    guard ->(_obj, args, ctx) {
      events = ctx[:convention].events.find(args[:runs].map { |run| run[:event_id] })
      events.all? do |event|
        ctx[:current_ability].can?(:create, event.runs.new)
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
