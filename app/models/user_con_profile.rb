class UserConProfile < ActiveRecord::Base
  MAIL_PRIV_NAMES = Set.new(%w(gms attendees vendors unpaid alumni).map { |group| "mail_to_#{group}" })
  PRIV_NAMES = Set.new(%w(bid_committee staff bid_chair gm_liaison registrar outreach con_com scheduling) + MAIL_PRIV_NAMES.to_a)

  belongs_to :convention
  belongs_to :user
  has_one :ticket, dependent: :destroy

  delegate :email, to: :user, allow_nil: true, prefix: true

  def paid?
    ticket
  end

  def unpaid?
    !ticket
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
