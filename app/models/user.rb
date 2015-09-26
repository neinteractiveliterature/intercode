class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true
  validates :preferred_contact, inclusion: { in: %w(email day_phone evening_phone), allow_nil: true }

  has_many :user_con_profiles
  has_many :team_members
  
  liquid_methods :email, :first_name, :last_name, :nickname

  # Return the user's name.
  def name
    [first_name, last_name].compact.join(" ")
  end

  # Return the user's name in last, first format.
  def name_inverted
    [last_name, first_name].compact.join(", ")
  end
  
  # More or less copied from:
  # http://stackoverflow.com/questions/819263/get-persons-age-in-ruby
  def age_as_of(date)
    return unless birth_date
    date.year - birth_date.year - ((date.month > birth_date.month || (date.month == birth_date.month && date.day >= birth_date.day)) ? 0 : 1)
  end
  
  def age
    age_as_of Date.today
  end
  
  def address
    city_state_zip = [[city, state].reject(&:blank?).join(", "), zipcode].reject(&:blank?).join(" ")
    [address1, address2, city_state_zip, country].reject(&:blank?).join("\n")
  end
  
  def privileges
    if site_admin?
      ['site_admin']
    else
      []
    end
  end
  
  def blank_password!
    @password_not_required = true
  end
  
  protected
  
  def password_required?
    return false if @password_not_required
    super
  end
end
