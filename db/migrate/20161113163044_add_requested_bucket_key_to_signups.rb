class AddRequestedBucketKeyToSignups < ActiveRecord::Migration[5.1]
  def change
    add_column :signups, :requested_bucket_key, :string
  end
end
