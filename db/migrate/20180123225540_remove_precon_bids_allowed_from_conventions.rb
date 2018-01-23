class RemovePreconBidsAllowedFromConventions < ActiveRecord::Migration[5.1]
  def change
    remove_column :conventions, :precon_bids_allowed, :boolean
  end
end
