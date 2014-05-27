class User < ActiveRecord::Base
  include Authority::UserAbilities

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :first_name, presence: true
  validates :last_name, presence: true

  validates_date :birth_date, allow_blank: true
  validates :default_gender, inclusion: { in: %w(either female male) }, allow_blank: true
  validates :nickname, length: { maximum: 30 }, allow_blank: true
  validates :phone, telephone: true, allow_blank: true
  
  liquid_methods :email, :first_name, :last_name, :nickname
end
