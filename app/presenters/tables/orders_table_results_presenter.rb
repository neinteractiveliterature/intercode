class Tables::OrdersTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, filters, sort)
    scope = convention.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])

    new(scope, filters, sort)
  end

  field :id, 'ID' do
    def apply_filter(scope, value)
      id = value.to_i
      return scope if id == 0

      scope.where(id: id)
    end
  end

  field :user_name, 'User' do
    def apply_filter(scope, value)
      scope.joins(:user_con_profile)
        .where(
          "lower(user_con_profiles.last_name) like :value \
OR lower(user_con_profiles.first_name) like :value",
          value: "%#{value.downcase}%"
        )
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:user_con_profile)
    end

    def sql_order(direction)
      "user_con_profiles.last_name #{direction}, user_con_profiles.first_name #{direction}"
    end

    def generate_csv_cell(order)
      order.user_con_profile.name_without_nickname
    end
  end

  field :status, 'Status' do
    column_filter filter_on_blank: true
  end

  field :submitted_at, 'Submitted'

  field :describe_products, 'Products' do
    def generate_csv_cell(order)
      order.order_entries.map(&:describe_products).join(', ')
    end
  end

  field :payment_amount, 'Payment amount' do
    def generate_csv_cell(order)
      order.payment_amount.format
    end
  end

  field :total_price, 'Price' do
    def generate_csv_cell(order)
      order.total_price.format
    end
  end

  private

  def csv_scope
    scoped.includes(:user_con_profile)
  end
end
