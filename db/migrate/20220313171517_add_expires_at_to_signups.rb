class AddExpiresAtToSignups < ActiveRecord::Migration[7.0]
  def change
    add_column :signups, :expires_at, :timestamp, null: true
    add_index :signups, :expires_at
  end
end
