class AdminOrdersController < ApplicationController
  include Concerns::SendCsv
  before_action :authorize_read_orders

  def export
    respond_to do |format|
      format.csv do
        send_table_presenter_csv(
          Tables::OrdersTableResultsPresenter.for_convention(
            convention,
            params[:filters]&.to_unsafe_h,
            params[:sort]
          ),
          "#{convention.name} Orders"
        )
      end
    end
  end

  private

  def authorize_read_orders
    authorize! :read, Order.new(user_con_profile: UserConProfile.new(convention: convention))
  end
end
