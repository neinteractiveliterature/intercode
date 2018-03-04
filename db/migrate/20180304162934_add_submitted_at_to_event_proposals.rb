class AddSubmittedAtToEventProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :event_proposals, :submitted_at, :datetime

    reversible do |dir|
      dir.up { EventProposal.where.not(status: 'draft').update_all('submitted_at = created_at') }
    end
  end
end
