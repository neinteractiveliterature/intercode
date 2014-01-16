class TeamMember < ActiveRecord::Base

  # All team members must be assigned to an event
  belongs_to :event
  validates :event, presence: :true

  # A team member is a user
  belongs_to :user
  validates :user, presence: :true

  # Set default values for a LARP event
  after_initialize do
    if new_record?
      # Display the team member
      self.display = false
    end
  end

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

  # Returns the User for this team member.  It's cached in an instance variable
  # so we'll only fetch it once (at least in this instance)
  def user
    @user ||= User.find(self.user_id)
  end
end
