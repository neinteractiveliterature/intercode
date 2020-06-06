class User < ApplicationRecord
  include Names

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :legacy_md5_authenticatable, :legacy_sha1_authenticatable,
    :registerable, :recoverable, :rememberable, :trackable, :validatable, :doorkeeper

  validates :name, presence: true

  has_many :user_con_profiles
  has_many :event_proposals, through: :user_con_profiles
  has_many :user_activity_alerts, dependent: :nullify
  has_many :tickets, through: :user_con_profiles
  has_and_belongs_to_many :organization_roles

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

  def serializable_hash(_options = nil)
    attributes.symbolize_keys.slice(
      :id, :email, :first_name, :last_name, :site_admin, :created_at, :updated_at
    )
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
