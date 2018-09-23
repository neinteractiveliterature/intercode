class AddAdminNotesToEventProposals < ActiveRecord::Migration[5.2]
  def change
    add_column :event_proposals, :admin_notes, :text
  end
end
