class AddRequestedBucketKeyToSignups < ActiveRecord::Migration[5.0]
  def change
    add_column :signups, :requested_bucket_key, :string
  end
end
