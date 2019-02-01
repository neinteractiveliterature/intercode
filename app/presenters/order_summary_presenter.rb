class OrderSummaryPresenter
  def self.preload_associations(user_con_profiles)
    ::ActiveRecord::Associations::Preloader.new.preload(
      user_con_profiles,
      orders: { order_entries: [:product, :product_variant] }
    )
  end

  attr_reader :user_con_profile

  def initialize(user_con_profile:)
    @user_con_profile = user_con_profile
  end

  def order_summary
    user_con_profile.orders.reject { |order| %w[pending cancelled].include?(order.status) }
      .map do |order|
        order.order_entries.flat_map do |order_entry|
          "#{order_entry.describe_products(always_show_quantity: true)} (#{order.status})"
        end
      end
      .join(', ')
  end
end
