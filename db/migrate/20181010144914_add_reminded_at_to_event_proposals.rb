class AddRemindedAtToEventProposals < ActiveRecord::Migration[5.2]
  def change
    add_column :event_proposals, :reminded_at, :datetime
  end
end
