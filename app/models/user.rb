class User < ApplicationRecord
  include Concerns::Names

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :legacy_md5_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true

  has_many :user_con_profiles

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

  def to_liquid
    UserDrop.new(self)
  end

  protected

  def password_required?
    return false if @password_not_required
    super
  end
end
