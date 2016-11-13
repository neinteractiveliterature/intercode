class Signup < ApplicationRecord
  STATES = %w(confirmed waitlisted withdrawn)

  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile
  belongs_to :run
  has_one :event, through: :run
  belongs_to :updated_by, class_name: "User", optional: true

  validates :state, inclusion: { in: STATES }

  STATES.each do |state_name|
    define_method "#{state_name}?" do
      state == state_name
    end

    scope state_name, -> { where(state: state_name) }
  end

  def bucket
    run.registration_policy.bucket_with_key(bucket_key)
  end

  def requested_bucket
    run.registration_policy.bucket_with_key(requested_bucket_key)
  end
end
