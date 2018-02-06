class User < ApplicationRecord
  include Concerns::Names

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :legacy_md5_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true

  has_many :user_con_profiles

  attr_accessor :reset_password_mail_options

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

  def send_reset_password_instructions_notification(token)
    send_devise_notification(:reset_password_instructions, token, reset_password_mail_options || {})
  end

  def password_required?
    return false if @password_not_required
    super
  end
end
