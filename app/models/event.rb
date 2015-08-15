class Event < ActiveRecord::Base
  STATUSES = Set.new(%w(proposed reviewing accepted rejected dropped))

  # Most events belong to the user who proposes it.  Some (like ConSuite or
  # Ops) are owned by the department head
  belongs_to :user
  validates :user, presence: true

  # LARPs have GMs and Panels have Members
  has_many :team_members

  # The user who last updated the event.  Used for tracking
  belongs_to :updated_by, :class_name => "User"

  # Each event must belong to a convention
  belongs_to :convention
  validates :convention, presence: true

  # Status specifies the status of the proposed event.  It must be one of
  # "Proposed", "Reviewing", "Accepted", "Rejected" or "Dropped".  Events
  # that need to be reviewed (LARPs, PreCon) must be reviewed and approved
  # by the approprite committee and default to "Proposed."  Events that don't
  # need to be approved (ConSuite, Ops, Filler) default to "Approved."
  validates :status,
    inclusion:
    { 
      :in => STATUSES
#      messsage: "%{value} is not a valid event status"
    }

  # All events for a Convention must have a unique title.  Ignore any events
  # that with a status of "Dropped" or "Rejected".  If they have a duplicate
  # title we don't care.
  validates_uniqueness_of :title,
    scope: :convention,
    conditions: -> { where.not(status: ['dropped', 'rejected']) }

  # Runs specify how many instances of this event there are on the schedule.
  # An event may have 0 or more runs.
  has_many :runs

#  validates :con_mail_destination, :inclusion => { :in => %w(game_email gms) }
end
