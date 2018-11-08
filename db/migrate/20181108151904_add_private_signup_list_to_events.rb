class AddPrivateSignupListToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :private_signup_list, :boolean, null: false, default: false
  end
end
