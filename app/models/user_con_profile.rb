class UserConProfile < ActiveRecord::Base
  MAIL_PRIV_NAMES = Set.new(%w(gms attendees vendors unpaid alumni).map { |group| "mail_to_#{group}" })
  PRIV_NAMES = Set.new(%w(bid_committee staff bid_chair gm_liaison registrar outreach con_com scheduling) + MAIL_PRIV_NAMES.to_a)

  PAID_REGISTRATION_STATUSES = Set.new(%w(paid comp marketing rollover))
  UNPAID_REGISTRATION_STATUSES = Set.new(%w(unpaid alumni))
  VENDOR_REGISTRATION_STATUSES = Set.new(%w(vendor))
  REGISTRATION_STATUSES = UNPAID_REGISTRATION_STATUSES + PAID_REGISTRATION_STATUSES + VENDOR_REGISTRATION_STATUSES
  validates :registration_status, :inclusion => { :in => REGISTRATION_STATUSES }

  belongs_to :convention
  belongs_to :user
  belongs_to :comp_event, :class_name => "Event"
  has_one :ticket

  scope :paid, -> { where(:registration_status => PAID_REGISTRATION_STATUSES) }
  scope :unpaid, -> { where(:registration_status => UNPAID_REGISTRATION_STATUSES) }
  scope :vendor, -> { where(:registration_status => VENDOR_REGISTRATION_STATUSES) }

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  delegate :email, to: :user, allow_nil: true, prefix: true

  def paid?
    PAID_REGISTRATION_STATUSES.include? registration_status
  end

  def unpaid?
    UNPAID_REGISTRATION_STATUSES.include? registration_status
  end

  def vendor?
    VENDOR_REGISTRATION_STATUSES.include? registration_status
  end

  def age_as_of_convention
    user.age_as_of convention.starts_at
  end

  def privileges
    user.privileges + PRIV_NAMES.select { |priv| self.send(priv) }
  end

  def user_email=(email)
    self.user = User.find_by(email: email)
  end
end
