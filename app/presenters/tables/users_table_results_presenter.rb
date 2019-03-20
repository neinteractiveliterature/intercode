class Tables::UsersTableResultsPresenter < Tables::TableResultsPresenter
  def fields
    [
      Tables::TableResultsPresenter::Field.new(:name, 'Name'),
      Tables::TableResultsPresenter::Field.new(:email, 'Email'),
      Tables::TableResultsPresenter::Field.new(:privileges, 'Privileges')
    ]
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :name
      scope.name_search(value)
    when :first_name
      scope.name_search(value, columns: %w[first_name])
    when :last_name
      scope.name_search(value, columns: %w[last_name])
    when :email
      scope.where('lower(email) like :value', value: "%#{value.downcase}%")
    when :privileges
      apply_privileges_filter(scope, value)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :name
      "lower(last_name) #{direction}, lower(first_name) #{direction}"
    when :first_name
      "lower(first_name) #{direction}"
    when :last_name
      "lower(last_name) #{direction}"
    when :email
      "lower(email) #{direction}"
    when :privileges
      clauses = ['site_admin'].map do |priv_name|
        "#{priv_name} #{invert_sort_direction direction}"
      end

      clauses.join(', ')
    else
      super
    end
  end

  def apply_privileges_filter(scope, value)
    return scope.where(site_admin: true) if value.include?('site_admin')
    scope
  end

  def generate_csv_cell(field, user)
    user.public_send(field.id)
  end
end
