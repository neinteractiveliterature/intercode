class RemoveSignupsAllowedFromConventions < ActiveRecord::Migration[5.1]
  def change
    remove_column :conventions, :signups_allowed, :string, default: "not_yet", null: false
  end
end
