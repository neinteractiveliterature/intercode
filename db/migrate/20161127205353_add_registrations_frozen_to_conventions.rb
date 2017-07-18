class AddRegistrationsFrozenToConventions < ActiveRecord::Migration[5.1]
  def change
    add_column :conventions, :registrations_frozen, :boolean, default: false, null: false
  end
end
