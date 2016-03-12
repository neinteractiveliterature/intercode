class UserConProfile < ActiveRecord::Base
  include Concerns::Names

  MAIL_PRIV_NAMES = Set.new(%w(gms attendees vendors unpaid alumni).map { |group| "mail_to_#{group}" })
  PRIV_NAMES = Set.new(%w(bid_committee staff bid_chair gm_liaison registrar outreach con_com scheduling) + MAIL_PRIV_NAMES.to_a)

  belongs_to :convention
  belongs_to :user
  has_one :ticket, dependent: :destroy
  has_many :team_members, dependent: :destroy

  delegate :email, to: :user, allow_nil: true

  validates :name, presence: true
  validates :preferred_contact, inclusion: { in: %w(email day_phone evening_phone), allow_blank: true }

  def paid?
    ticket
  end

  def unpaid?
    !ticket
  end

  def age_as_of_convention
    age_as_of convention.starts_at
  end

  # More or less copied from:
  # http://stackoverflow.com/questions/819263/get-persons-age-in-ruby
  def age_as_of(date)
    return unless birth_date

    on_or_after_birthday = (
      date.month > birth_date.month || (
        date.month == birth_date.month &&
        date.day >= birth_date.day
      )
    )

    date.year - birth_date.year - (on_or_after_birthday ? 0 : 1)
  end

  def age
    age_as_of Date.today
  end

  def address
    [address1, address2, city_state_zip, country].reject(&:blank?).join("\n")
  end

  def city_state_zip
    [city_state, zipcode].reject(&:blank?).join(" ")
  end

  def city_state
    [city, state].reject(&:blank?).join(", ")
  end

  def privileges
    user.privileges + PRIV_NAMES.select { |priv| self.send(priv) }
  end

  def email=(email)
    self.user = User.find_by(email: email)
    self.first_name ||= user.first_name
    self.last_name ||= user.last_name
  end

  def preferred_contact_humanized
    case preferred_contact
    when 'day_phone' then 'Daytime phone'
    when 'evening_phone' then 'Evening phone'
    when 'email' then 'Email'
    else preferred_contact.try(:humanize)
    end
  end
end
