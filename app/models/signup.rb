class Signup < ApplicationRecord
  STATES = %w[confirmed waitlisted withdrawn]

  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile
  belongs_to :run
  has_one :event, through: :run
  has_one :convention, through: :event
  belongs_to :updated_by, class_name: 'User', optional: true

  validates :state, inclusion: { in: STATES }
  validates :bucket_key, presence: { if: -> (signup) { signup.counted? && signup.confirmed? } }
  validates :requested_bucket_key, presence: { if: :counted? }
  # validate :must_be_counted_if_and_only_if_not_team_member
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

  def to_liquid
    SignupDrop.new(self)
  end

  private

  #
  # def must_be_counted_if_and_only_if_not_team_member
  #   if team_member?
  #     errors.add(:counted, "must be false for team members") if counted?
  #   else
  #     errors.add(:counted, "must be true for non-team members") if !counted?
  #   end
  # end

  def must_be_in_existing_bucket
    return if can_have_invalid_buckets?

    errors.add(:bucket_key, bucket_validity_error_message) if invalid_bucket?
    errors.add(:requested_bucket_key, bucket_validity_error_message) if invalid_requested_bucket?
  end

  def can_have_invalid_buckets?
    !counted? || withdrawn?
  end

  def invalid_bucket?
    bucket_key && !bucket
  end

  def invalid_requested_bucket?
    requested_bucket_key && !requested_bucket
  end

  def bucket_validity_error_message
    @bucket_validity_error_message ||= begin
      bucket_names = run.registration_policy.buckets.map(&:key).to_sentence(
        last_word_connector: ', or ',
        two_words_connector: ' or '
      )

      "must be one of #{bucket_names}"
    end
  end
end
