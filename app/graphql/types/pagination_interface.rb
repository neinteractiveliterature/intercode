module Types::PaginationInterface
  include Types::BaseInterface

  field :total_entries, Integer, null: false, camelize: false
  field :total_pages, Integer, null: false, camelize: false
  field :current_page, Integer, null: false, camelize: false
  field :per_page, Integer, null: false, camelize: false

  definition_methods do
    def resolve_type(obj, _ctx)
      "Types::#{obj.klass.name}Type".safe_constantize
    end
  end
end
