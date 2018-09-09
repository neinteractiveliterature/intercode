Types::UsersPaginationType = GraphQL::ObjectType.define do
  name 'UsersPagination'

  field :total_entries, !types.Int
  field :total_pages, !types.Int
  field :current_page, !types.Int
  field :per_page, !types.Int
  field :entries, !types[Types::UserType] do
    resolve ->(obj, _args, _ctx) do
      obj.to_a
    end
  end
end
