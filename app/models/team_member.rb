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
end
