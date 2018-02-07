Mutations::DeletePage = GraphQL::Relay::Mutation.define do
  name 'DeletePage'
  return_field :page, Types::PageType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    page = ctx[:convention].pages.find(args[:id])
    page.destroy!
    { page: page }
  }
end
