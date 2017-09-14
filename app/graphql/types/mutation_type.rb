Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"
  field :deleteRun, Mutations::DeleteRun.field
  field :updateRun, Mutations::UpdateRun.field
  field :createRun, Mutations::CreateRun.field
end
