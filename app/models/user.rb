class User < ActiveRecord::Base
  include Authority::UserAbilities

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me,
    :first_name, :last_name, :nickname, :birth_date, :gender, :address1,
    :address2, :city, :state, :zipcode, :country, :day_phone, :evening_phone,
    :best_call_time, :preferred_contact
    
  validates :first_name, presence: true
  validates :last_name, presence: true
  
  liquid_methods :email, :first_name, :last_name, :nickname
end
