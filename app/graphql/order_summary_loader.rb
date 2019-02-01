class OrderSummaryLoader < GraphQL::Batch::Loader
  def perform(keys)
    OrderSummaryPresenter.preload_associations(keys)

    keys.each do |user_con_profile|
      fulfill(
        user_con_profile,
        OrderSummaryPresenter.new(user_con_profile: user_con_profile).order_summary
      )
    end
  end
end
