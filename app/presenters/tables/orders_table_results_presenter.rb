class Tables::OrdersTableResultsPresenter < Tables::TableResultsPresenter
  private

  def apply_filter(scope, filter, value)
    case filter
    when :user_name
      scope.joins(:user_con_profile)
        .where(
          'lower(user_con_profiles.last_name) like :value OR lower(user_con_profiles.first_name) like :value',
          value: "%#{value.downcase}%"
        )
    when :status
      scope.where(status: value)
    else
      scope
    end
  end

  def expand_scope_for_sort(scope, sort_field)
    case sort_field
    when :user_name
      scope.joins(:user_con_profile)
    when :total_price
      scope.joins(:order_entries)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :user_name
      "user_con_profiles.last_name #{direction}, user_con_profiles.first_name #{direction}"
    else
      super
    end
  end
end
