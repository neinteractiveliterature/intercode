class EmailForwardersController < ApplicationController
  before_action :enforce_authentication

  def show
    render json: { forward_addresses: EmailForwardingRouter.new(params[:address]).forward_addresses }
  end

  private

  def enforce_authentication
    authenticate_or_request_with_http_token do |token|
      ActiveSupport::SecurityUtils.secure_compare(token, ENV.fetch("EMAIL_FORWARDERS_API_TOKEN"))
    end
  end
end
