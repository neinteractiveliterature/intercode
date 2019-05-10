class SessionsController < Devise::SessionsController
  prepend_before_action :set_return_to, only: [:create]

  # def create
  #   super

  #   respond_to do |format|
  #     format.html {}
  #     format.json do
  #       render json: { user_id: current_user.id }
  #     end
  #   end
  # end

  private

  def set_return_to
    return unless params[:user_return_to].present?
    session[:user_return_to] = params[:user_return_to]
  end
end
