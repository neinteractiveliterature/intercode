class AddSignupRequestsOpenToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :signup_requests_open, :boolean, null: false, default: false
  end
end
