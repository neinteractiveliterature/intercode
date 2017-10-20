class RenameAcceptingBidsToAcceptingProposals < ActiveRecord::Migration[5.1]
  def change
    rename_column :conventions, :accepting_bids, :accepting_proposals
  end
end
