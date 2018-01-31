Mutations::UpdateRun = GraphQL::Relay::Mutation.define do
  name 'UpdateRun'
  return_field :run, Types::RunType

  input_field :id, !types.Int
  input_field :run, !Types::RunInputType

  resolve ->(_obj, args, ctx) {
    run = ctx[:convention].runs.find(args[:id])

    run.update!(
      args[:run].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    { run: run }
  }
end
