# frozen_string_literal: true
module Types::PaginationInterface
  include Types::BaseInterface

  description <<~MARKDOWN
    PaginationInterface provides a way to use offset-based pagination on a list of objects. This
    is useful for UIs such as Intercode's table views, which provide a way to jump between numbered
    pages.

    Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,
    etc.) The number of items per page can be controlled via the per_page argument on paginated
    fields. It defaults to 20, and can go up to 200.

    Offset-based pagination is different from
    [Relay's cursor-based pagination](https://relay.dev/graphql/connections.htm) that is more
    commonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI
    needs, but if a cursor-based approach is desirable in the future, we may also implement Relay
    connections alongside our existing pagination fields.
  MARKDOWN

  field :current_page, Integer, null: false, camelize: false do
    description "The number of the page currently being returned in this query"
  end
  field :per_page, Integer, null: false, camelize: false do
    description "The number of items per page currently being returned in this query"
  end
  field :total_entries, Integer, null: false, camelize: false do
    description "The total number of items in the paginated list (across all pages)"
  end
  field :total_pages, Integer, null: false, camelize: false do
    description "The total number of pages in the paginated list"
  end

  definition_methods do
    def resolve_type(obj, _ctx)
      "Types::#{obj.klass.name}Type".safe_constantize
    end
  end
end
