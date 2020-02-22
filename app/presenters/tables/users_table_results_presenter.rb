class Tables::UsersTableResultsPresenter < Tables::TableResultsPresenter
  field :id, 'ID'

  field :name, 'Name' do
    def apply_filter(scope, value)
      scope.name_search(value)
    end

    def sql_order(direction)
      "lower(last_name) #{direction}, lower(first_name) #{direction}"
    end
  end

  field :first_name, 'First name' do
    def apply_filter(scope, value)
      scope.name_search(value, columns: %w[first_name])
    end

    def sql_order(direction)
      "lower(first_name) #{direction}"
    end
  end

  field :last_name, 'Last name' do
    def apply_filter(scope, value)
      scope.name_search(value, columns: %w[last_name])
    end

    def sql_order(direction)
      "lower(last_name) #{direction}"
    end
  end

  field :email, 'Email' do
    def apply_filter(scope, value)
      scope.where('lower(email) like :value', value: "%#{value.downcase}%")
    end

    def sql_order(direction)
      "lower(email) #{direction}"
    end
  end

  field :privileges, 'Privileges' do
    def apply_filter(scope, value)
      return scope.where(site_admin: true) if value.include?('site_admin')
      scope
    end

    def sql_order(direction)
      clauses = ['site_admin'].map do |priv_name|
        "#{priv_name} #{invert_sort_direction direction}"
      end

      clauses.join(', ')
    end
  end
end
