class UserConProfile < ActiveRecord::Base
  MAIL_PRIV_NAMES = Set.new(%w(gms attendees vendors unpaid alumni).map { |group| "mail_to_#{group}" })
  PRIV_NAMES = Set.new(%w(bid_committee staff bid_chair gm_liaison registrar outreach con_com scheduling) + MAIL_PRIV_NAMES.to_a)

  PAID_REGISTRATION_STATUSES = Set.new(%w(paid comp marketing rollover))
  UNPAID_REGISTRATION_STATUSES = Set.new(%w(unpaid alumni))
  VENDOR_REGISTRATION_STATUSES = Set.new(%w(vendor))
  validates :registration_status, :inclusion => { :in => PAID_REGISTRATION_STATUSES + UNPAID_REGISTRATION_STATUSES + VENDOR_REGISTRATION_STATUSES }

  belongs_to :convention
  belongs_to :user
  belongs_to :comp_event, :class_name => "Event"  

  scope :paid, where(:registration_status => PAID_REGISTRATION_STATUSES)
  scope :unpaid, where(:registration_status => UNPAID_REGISTRATION_STATUSES)
  scope :vendor, where(:registration_status => VENDOR_REGISTRATION_STATUSES)

  def paid?
    PAID_REGISTRATION_STATUSES.include? registration_status
  end

  def unpaid?
    UNPAID_REGISTRATION_STATUSES.include? registration_status
  end

  def vendor?
    VENDOR_REGISTRATION_STATUSES.include? registration_status
  end
end
