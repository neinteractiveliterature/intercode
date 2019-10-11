class UsersController < ApplicationController
  include SendCsv

  before_action :authorize_read_users

  def export
    respond_to do |format|
      format.csv do
        send_table_presenter_csv(
          Tables::UsersTableResultsPresenter.new(
            policy_scope(User.all),
            params[:filters]&.to_unsafe_h,
            params[:sort],
            params[:columns]
          ),
          'Users'
        )
      end
    end
  end

  private

  def authorize_read_users
    authorize User.new, :read?
  end
end
