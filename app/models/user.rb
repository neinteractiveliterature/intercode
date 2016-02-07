class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true

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
