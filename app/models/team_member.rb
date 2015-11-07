class TeamMember < ActiveRecord::Base
  # All team members must be assigned to an event that exists
  belongs_to :event
  validates :event, presence: true

  # A team member is a user that exits, and that he's not already a member
  # of the team for this event
  belongs_to :user
  validates :user, presence: true
  validates_uniqueness_of :user_id, scope: :event

  belongs_to :updated_by, class_name: "User"

  delegate :name, to: :user

  scope :visible, -> { where(display: true) }

  # Return the email address for the team member, if it is to be displayed.
  # If not, return an empty string
  def email
    if show_email?
      user.email
    else
      ''
    end
  end
end
