class RemoveRegistrationsFrozenFromConventions < ActiveRecord::Migration[5.1]
  def change
    remove_column :conventions, :registrations_frozen, :boolean, null: false, default: false
  end
end
