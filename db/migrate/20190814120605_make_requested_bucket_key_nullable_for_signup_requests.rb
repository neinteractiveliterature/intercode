class MakeRequestedBucketKeyNullableForSignupRequests < ActiveRecord::Migration[5.2]
  def change
    change_column_null :signup_requests, :requested_bucket_key, true
  end
end
