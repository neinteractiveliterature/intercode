class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :first_name, presence: true
  validates :last_name, presence: true
  
  liquid_methods :email, :first_name, :last_name, :nickname

  # Return the user's name.  Should this include the nickname, if one exists?
  def name
    self.last_name + ', ' + self.first_name
  end
end
