class AuthenticityTokensController < ApplicationController
  skip_authorization_check

  def show
    render json: authenticity_token_props
  end
end
