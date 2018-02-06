class TeamMember < ApplicationRecord
  # All team members must be assigned to an event that exists
  belongs_to :event
  belongs_to :user_con_profile
  has_one :user, through: :user_con_profile

  # A team member is a user that exists, and is not already a member
  # of the team for this event
  validates :user_con_profile, presence: true
  validates_uniqueness_of :user_con_profile_id, scope: :event_id

  validates :event, presence: true
  validate :user_con_profile_and_event_must_belong_to_same_convention

  belongs_to :updated_by, class_name: 'User', optional: true

  delegate :name, to: :user_con_profile

  scope :visible, -> { where(display: true) }

  # Return the email address for the team member, if it is to be displayed.
  # If not, return an empty string
  def email
    user_con_profile.email if show_email?
  end

  private

  def user_con_profile_and_event_must_belong_to_same_convention
    return unless event && user_con_profile
    return if event.convention == user_con_profile.convention

    errors.add(:base, "User con profile and event must belong to the same convention!  \
User con profile for #{user_con_profile.name} is from #{user_con_profile.convention.name} and \
event #{event.name} is from #{event.convention.name}.")
  end
end
