class TeamMember < ActiveRecord::Base
  # All team members must be assigned to an event that exists
  belongs_to :event
  validates :event, presence: true

  # A team member is a user that exists, and is not already a member
  # of the team for this event
  belongs_to :user
  validates :user, presence: true
  validates_uniqueness_of :user_id, scope: :event_id

  belongs_to :updated_by, class_name: "User"

  delegate :name, to: :user

  scope :visible, -> { where(display: true) }

  # Return the email address for the team member, if it is to be displayed.
  # If not, return an empty string
  def email
    user.email if show_email?
  end
end
