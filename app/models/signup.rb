class Signup < ApplicationRecord
  STATES = %w(confirmed waitlisted withdrawn)

  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile
  belongs_to :run
  has_one :event, through: :run
  belongs_to :updated_by, class_name: "User", optional: true

  validates :state, inclusion: { in: STATES }
  validates :bucket_key, presence: { if: -> (signup) { signup.counted? && signup.confirmed? } }
  validates :requested_bucket_key, presence: { if: :counted? }
  validate :must_be_counted_if_and_only_if_not_team_member
  validate :must_be_in_existing_bucket

  STATES.each do |state_name|
    define_method "#{state_name}?" do
      state == state_name
    end

    scope state_name, -> { where(state: state_name) }
  end

  scope :counted, -> { where(counted: true) }
  scope :not_counted, -> { where.not(counted: true) }

  def bucket
    run.registration_policy.bucket_with_key(bucket_key)
  end

  def requested_bucket
    run.registration_policy.bucket_with_key(requested_bucket_key)
  end

  def team_member?
    event.team_members.any? { |team_member| team_member.user_con_profile == user_con_profile }
  end

  private

  def must_be_counted_if_and_only_if_not_team_member
    if team_member?
      errors.add(:counted, "must be false for team members") if counted?
    else
      errors.add(:counted, "must be true for non-team members") if !counted?
    end
  end

  def must_be_in_existing_bucket
    return if !counted? || withdrawn?

    bucket_names = run.registration_policy.buckets.map(&:key).to_sentence(last_word_connector: ", or ", two_words_connector: " or ")
    errors.add(:bucket_key, "must be one of #{bucket_names}") if bucket_key && !bucket
    errors.add(:requested_bucket_key, "must be one of #{bucket_names}") if requested_bucket_key && !requested_bucket
  end
end
