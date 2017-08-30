class Event < ApplicationRecord
  STATUSES = Set.new(%w(active dropped))
  CATEGORIES = Set.new(%w(larp panel board_game tabletop_rpg volunteer_event filler))
  CON_MAIL_DESTINATIONS = Set.new(%w(event_email gms))

  # Most events belong to the user who proposes it.  Some (like ConSuite or
  # Ops) are owned by the department head
  belongs_to :owner, class_name: "User", optional: true

  # LARPs have GMs and Panels have Members
  has_many :team_members, dependent: :destroy

  # The user who last updated the event.  Used for tracking
  belongs_to :updated_by, :class_name => "User", optional: true

  # Each event must belong to a convention
  belongs_to :convention
  validates :convention, presence: true

  # Status specifies the status of the event.  It must be one of
  # "active" or "dropped".
  validates :status, inclusion: { in: STATUSES, allow_nil: true }

  # Category is mostly for record-keeping purposes; it shouldn't actually
  # affect behavior of events.  Nevertheless we do want to make sure it's
  # in one of the allowed categories.
  validates :category, inclusion: { in: CATEGORIES }

  # All events for a Convention must have a unique title.  Ignore any events
  # that have a status of "Dropped".  If they have a duplicate title we don't
  # care.
  validates_uniqueness_of :title,
    scope: :convention,
    conditions: -> { where.not(status: 'dropped') }

  # The event's registration policy must also be valid.
  validate :validate_registration_policy

  # Runs specify how many instances of this event there are on the schedule.
  # An event may have 0 or more runs.
  has_many :runs, dependent: :destroy

  scope :active, -> { where(status: 'active') }

  serialize :registration_policy, ActiveModelCoder.new('RegistrationPolicy')

#  validates :con_mail_destination, :inclusion => { :in => %w(game_email gms) }

  def self.build_con_suite
    new(
      title: "ConSuite",
      short_blurb: "Help serve Intercon breakfast, lunch, and dinner.",
      description: "Help serve Intercon breakfast, lunch, and dinner.",

      # The Con Suite event does not need to be reviewed
      status: "active",
      category: "volunteer_event"
    )
  end

  def self.build_ops
    new(
      title: "Ops!",
      short_blurb: "Volunteer for Ops shifts!",
      description:
        "The Intercon Operations Crew takes care of ensuring the cogs of the " +
        "con keep on turning. Whether it's handing out registration packets, " +
        "setting up for the raffle, helping players find games, or any of the " +
        "dozens of other things that come up, Ops needs volunteers like you " +
        "to make it happen. Volunteering for Ops shifts is a valuable use of " +
        "your time and effort.",

      # The Ops event does not need to be reviewed
      status: "active",
      category: "volunteer_event"
    )
  end

  def to_param
    "#{id}-#{title.parameterize}"
  end

  def team_member_name
    case category
    when 'larp' then 'GM'
    else 'team member'
    end
  end

  def to_liquid
    EventDrop.new(self)
  end

  private

  def validate_registration_policy
    return unless registration_policy
    return if registration_policy.valid?

    registration_policy.errors.each do |attribute, error|
      errors.add "registration_policy.#{attribute}", error
    end
  end
end
