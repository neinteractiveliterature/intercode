# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: users
#
#  id                        :bigint           not null, primary key
#  current_sign_in_at        :datetime
#  current_sign_in_ip        :string
#  email                     :string           default(""), not null
#  encrypted_password        :string           default(""), not null
#  first_name                :string           not null
#  last_name                 :string           not null
#  last_sign_in_at           :datetime
#  last_sign_in_ip           :string
#  legacy_password_md5       :text
#  legacy_password_sha1      :text
#  legacy_password_sha1_salt :text
#  remember_created_at       :datetime
#  reset_password_sent_at    :datetime
#  reset_password_token      :string
#  sign_in_count             :integer          default(0)
#  site_admin                :boolean
#  created_at                :datetime
#  updated_at                :datetime
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class User < ApplicationRecord
  include Names

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :legacy_md5_authenticatable,
         :legacy_sha1_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable,
         :doorkeeper

  validates :name, presence: true

  has_many :user_con_profiles
  has_many :event_proposals, through: :user_con_profiles
  has_many :user_activity_alerts, dependent: :nullify
  has_many :tickets, through: :user_con_profiles
  has_and_belongs_to_many :organization_roles

  attr_accessor :reset_password_mail_options

  def privileges
    site_admin? ? ['site_admin'] : []
  end

  def blank_password!
    @password_not_required = true
  end

  def to_liquid
    UserDrop.new(self)
  end

  def serializable_hash(_options = nil)
    attributes.symbolize_keys.slice(:id, :email, :first_name, :last_name, :site_admin, :created_at, :updated_at)
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
