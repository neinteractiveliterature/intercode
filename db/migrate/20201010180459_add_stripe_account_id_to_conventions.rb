class AddStripeAccountIdToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :stripe_account_id, :text
    add_column :conventions, :stripe_account_ready_to_charge, :boolean, null: false, default: false
  end
end
