Mutations::DeleteRun = GraphQL::Relay::Mutation.define do
  name "DeleteRun"
  return_field :run, Types::RunType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    run = ctx[:convention].runs.find(args[:id])
    run.destroy!
    { run: run }
  }
end
