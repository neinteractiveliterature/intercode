class Signup < ActiveRecord::Base
  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile
  belongs_to :run
  has_one :event, through: :run
  belongs_to :updated_by, class_name: "User"

  def bucket
    run.registration_policy.bucket_with_key(bucket_key)
  end
end
