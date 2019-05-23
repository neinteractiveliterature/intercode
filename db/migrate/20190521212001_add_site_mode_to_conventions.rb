class AddSiteModeToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :site_mode, :string, null: false, default: 'convention'
  end
end
