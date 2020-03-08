class Tables::ConventionsTableResultsPresenter < Tables::TableResultsPresenter
  field :id, 'ID'

  field :name, 'Name' do
    ilike_column_filter :name
  end

  field :organization_name, 'Organization name' do
    ilike_column_filter :name, association_name: :organization

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:organization)
    end

    def sql_order(direction)
      "lower(organizations.name) #{direction}"
    end
  end

  field :starts_at, 'Starts at'
  field :ends_at, 'Ends at'
end
