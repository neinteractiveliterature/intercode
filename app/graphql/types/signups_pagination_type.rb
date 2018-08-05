Types::SignupsPaginationType = GraphQL::ObjectType.define do
  name 'SignupsPagination'

  field :total_entries, !types.Int
  field :total_pages, !types.Int
  field :current_page, !types.Int
  field :per_page, !types.Int
  field :entries, !types[Types::SignupType] do
    resolve ->(obj, _args, _ctx) do
      obj.to_a
    end
  end
end
