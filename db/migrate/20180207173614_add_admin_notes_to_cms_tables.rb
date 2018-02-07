class AddAdminNotesToCmsTables < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :admin_notes, :text
    add_column :cms_partials, :admin_notes, :text
    add_column :cms_layouts, :admin_notes, :text
  end
end
