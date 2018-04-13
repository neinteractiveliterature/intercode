class AdminOrdersController < ApplicationController
  include Concerns::SendCsv
  before_action :authorize_read_orders

  def export
    respond_to do |format|
      format.csv do
        table = Tables::OrdersTableResultsPresenter.for_convention(
          convention,
          params[:filters]&.to_unsafe_h,
          params[:sort]
        )
        filter_descriptions = table.filter_descriptions
        name_suffix = if filter_descriptions.any?
          " (#{filter_descriptions.map { |desc| desc.gsub(':', ' -') }.join(', ')})"
        else
          ''
        end

        configure_csv_headers("#{convention.name} Orders#{name_suffix}.csv")
        self.response_body = table.csv_enumerator
      end
    end
  end

  private

  def authorize_read_orders
    authorize! :read, Order.new(user_con_profile: UserConProfile.new(convention: convention))
  end
end
