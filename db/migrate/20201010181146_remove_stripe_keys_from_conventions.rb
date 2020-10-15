class RemoveStripeKeysFromConventions < ActiveRecord::Migration[6.0]
  def change
    remove_column :conventions, :stripe_publishable_key, :text
    remove_column :conventions, :stripe_secret_key, :text
  end
end
