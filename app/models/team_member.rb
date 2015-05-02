class TeamMember < ActiveRecord::Base

  # All team members must be assigned to an event that exists
  belongs_to :event
  validates :event_id, presence: :true, numericality: { only_integer: true }
  validate :validate_event_id

  # A team member is a user that exits, and that he's not already a member
  # of the team for this event
  belongs_to :user
  validates :user_id, presence: :true, numericality: { only_integer: true }
  validate :validate_user_id
  validates_uniqueness_of :user_id, scope: :event

  # Return the name of the team member
  def name
    user().name
  end

  # Return the email address for the team member, if it is to be displayed.
  # If not, return an empty string
  def email
    if self.show_email
      user().email
    else
      ''
    end
  end

private
  def validate_user_id
    errors.add(:user_id, 'is invalid') unless User.exists?(self.user_id)
  end

  def validate_event_id
    errors.add(:event_id, 'is invalid') unless Event.exists?(self.event_id)
  end
end
