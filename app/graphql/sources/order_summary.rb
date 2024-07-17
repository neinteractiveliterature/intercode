# frozen_string_literal: true
class Sources::OrderSummary < GraphQL::Dataloader::Source
  def fetch(keys)
    OrderSummaryPresenter.preload_associations(keys)
    keys.map { |user_con_profile| OrderSummaryPresenter.new(user_con_profile:).order_summary }
  end
end
