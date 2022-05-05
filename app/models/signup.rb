# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: signups
#
#  id                   :bigint           not null, primary key
#  bucket_key           :string
#  counted              :boolean
#  expires_at           :datetime
#  requested_bucket_key :string
#  state                :string           default("confirmed"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  run_id               :bigint
#  updated_by_id        :bigint
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_signups_on_expires_at           (expires_at)
#  index_signups_on_run_id               (run_id)
#  index_signups_on_updated_by_id        (updated_by_id)
#  index_signups_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (run_id => runs.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Signup < ApplicationRecord
  STATES = Types::SignupStateType.values.values.map(&:value).freeze

  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile
  belongs_to :run
  has_one :event, through: :run
  has_one :convention, through: :event
  has_one :signup_request, foreign_key: 'result_signup_id', dependent: :destroy
  belongs_to :updated_by, class_name: 'User', optional: true
  has_many :signup_changes, dependent: :destroy

  validates :state, inclusion: { in: STATES }
  validates :bucket_key, presence: { if: ->(signup) { signup.counted? && signup.confirmed? } }
  validate :must_be_in_existing_bucket
  validate :user_con_profile_and_run_must_be_in_same_convention

  STATES.each do |state_name|
    define_method "#{state_name}?" do
      state == state_name
    end

    scope state_name, -> { where(state: state_name) }
  end

  scope :counted, -> { where(counted: true) }
  scope :not_counted, -> { where.not(counted: true) }
  scope :expired, -> { where('expires_at < ?', Time.now) }
  scope :not_expired, -> { where('expires_at >= ? or expires_at is null', Time.now) }

  def bucket
    run.registration_policy.bucket_with_key(bucket_key)
  end

  def requested_bucket
    run.registration_policy.bucket_with_key(requested_bucket_key)
  end

  def team_member?
    event.team_members.any? { |team_member| team_member.user_con_profile == user_con_profile }
  end

  def no_preference?
    requested_bucket_key.nil?
  end

  def to_liquid
    SignupDrop.new(self)
  end

  def choice
    index = user_con_profile.signups.select(&:counted?).sort_by(&:created_at).index(self)
    index ? index + 1 : nil
  end

  def age_restrictions_check
    return 'N/A' if event.minimum_age.blank?
    return 'Unknown age' if user_con_profile.birth_date.blank?

    user_con_profile.age_as_of(run.starts_at) >= event.minimum_age ? 'OK' : 'Too young'
  end

  def log_signup_change!(**attrs)
    save! unless persisted?
    signup_changes.create!(
      {
        signup: self,
        run_id: run_id,
        user_con_profile_id: user_con_profile_id,
        previous_signup_change: signup_changes.order(created_at: :desc).first,
        updated_by_id: updated_by_id,
        bucket_key: bucket_key,
        requested_bucket_key: requested_bucket_key,
        state: state,
        counted: counted,
        **attrs
      }
    )
  end

  private

  def must_be_in_existing_bucket
    return if can_have_invalid_buckets?

    errors.add(:bucket_key, bucket_validity_error_message) if invalid_bucket?
    errors.add(:requested_bucket_key, bucket_validity_error_message) if invalid_requested_bucket?
  end

  def user_con_profile_and_run_must_be_in_same_convention
    return if user_con_profile.convention_id == event.convention_id

    errors.add(:base, 'User con profile and run must be in the same convention')
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
    @bucket_validity_error_message ||=
      begin
        bucket_names =
          run
            .registration_policy
            .buckets
            .map(&:key)
            .to_sentence(last_word_connector: ', or ', two_words_connector: ' or ')

        "must be one of #{bucket_names}"
      end
  end
end
