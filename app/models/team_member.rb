# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: team_members
#
#  id                   :integer          not null, primary key
#  display              :boolean
#  receive_con_email    :boolean
#  receive_signup_email :string           default("no"), not null
#  show_email           :boolean
#  created_at           :datetime
#  updated_at           :datetime
#  event_id             :bigint
#  updated_by_id        :integer
#  user_con_profile_id  :bigint           not null
#
# Indexes
#
#  index_team_members_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class TeamMember < ApplicationRecord
  # All team members must be assigned to an event that exists
  belongs_to :event
  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile

  # A team member is a user that exists, and is not already a member
  # of the team for this event
  validates :user_con_profile, presence: true
  validates :user_con_profile_id, uniqueness: { scope: :event_id }

  validates :receive_signup_email, inclusion: { in: Types::ReceiveSignupEmailType.values.keys.map(&:downcase) }

  validates :event, presence: true
  validate :user_con_profile_and_event_must_belong_to_same_convention

  belongs_to :updated_by, class_name: 'User', optional: true

  delegate :name, to: :user_con_profile

  scope :visible, -> { where(display: true) }
  scope :for_active_events, -> { joins(:event).where(events: { status: 'active' }) }

  # Return the email address for the team member, if it is to be displayed.
  # If not, return an empty string
  def email
    user_con_profile.email if show_email? && display_team_member
  end

  def receive_signup_email=(value)
    self[:receive_signup_email] = value&.downcase
  end

  def display_team_member
    display
  end

  def display_team_member=(value)
    self.display = value
  end

  private

  def user_con_profile_and_event_must_belong_to_same_convention
    return unless event && user_con_profile
    return if event.convention == user_con_profile.convention

    errors.add(
      :base,
      "User con profile and event must belong to the same convention!  \
User con profile for #{user_con_profile.name} is from #{user_con_profile.convention.name} and \
event #{event.name} is from #{event.convention.name}."
    )
  end
end
