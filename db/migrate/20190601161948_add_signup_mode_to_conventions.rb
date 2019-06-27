class AddSignupModeToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :signup_mode, :string, null: false, default: 'self_service'
  end
end
