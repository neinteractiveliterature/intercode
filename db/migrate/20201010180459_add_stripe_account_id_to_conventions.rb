class AddStripeAccountIdToConventions < ActiveRecord::Migration[6.0]
  def change
    add_column :conventions, :stripe_account_id, :text
  end
end
