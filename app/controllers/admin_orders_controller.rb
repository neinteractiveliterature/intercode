class AdminOrdersController < ApplicationController
  before_action :authorize_read_orders

  def index
  end

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
        csv_filename = "#{convention.name} Orders#{name_suffix}.csv"

        headers["X-Accel-Buffering"] = "no"
        headers["Cache-Control"] = "no-cache"
        headers["Content-Type"] = "text/csv; charset=utf-8"
        headers["Content-Disposition"] = %(attachment; filename="#{csv_filename}")
        headers["Last-Modified"] = Time.zone.now.ctime.to_s
        self.response_body = table.csv_enumerator
      end
    end
  end

  private

  def authorize_read_orders
    authorize! :read, Order.new(user_con_profile: UserConProfile.new(convention: convention))
  end
end
