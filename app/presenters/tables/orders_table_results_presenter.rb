class Tables::OrdersTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, filters, sort)
    scope = convention.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])

    new(scope, filters, sort)
  end

  def fields
    [
      Tables::TableResultsPresenter::Field.new(:user_name, 'User'),
      Tables::TableResultsPresenter::Field.new(:status, 'Status'),
      Tables::TableResultsPresenter::Field.new(:submitted_at, 'Submitted'),
      Tables::TableResultsPresenter::Field.new(:describe_products, 'Products'),
      Tables::TableResultsPresenter::Field.new(:total_price, 'Price')
    ]
  end

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

  def csv_scope
    scoped.includes(:user_con_profile)
  end

  def generate_csv_cell(field, order)
    case field.id
    when :user_name then order.user_con_profile.name_without_nickname
    when :describe_products then order.order_entries.map(&:describe_products).join(', ')
    when :total_price then order.total_price.format
    else order.public_send(field.id)
    end
  end
end
