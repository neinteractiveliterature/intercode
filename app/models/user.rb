class User < ActiveRecord::Base
  include Concerns::Names

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :legacy_md5_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true

  has_many :user_con_profiles

  liquid_methods :email, :first_name, :last_name, :nickname

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
