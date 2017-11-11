class AddDefaultLayoutToConventions < ActiveRecord::Migration[5.1]
  def change
    add_reference :conventions, :default_layout, foreign_key: { to_table: :cms_layouts }
  end
end
