class RenameBidPermissions < ActiveRecord::Migration[5.1]
  def change
    rename_column :user_con_profiles, :bid_committee, :proposal_committee
    rename_column :user_con_profiles, :bid_chair, :proposal_chair
  end
end
