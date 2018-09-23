class AddAdminNotesToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :admin_notes, :text
  end
end
