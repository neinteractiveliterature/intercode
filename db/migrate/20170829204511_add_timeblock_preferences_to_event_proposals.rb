class AddTimeblockPreferencesToEventProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :event_proposals, :timeblock_preferences, :text
  end
end
