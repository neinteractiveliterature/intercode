class Event < ActiveRecord::Base
  belongs_to :updated_by, :class_name => "User"
  store :special_event_flags  
  validates :con_mail_destination, :inclusion => { :in => %w(game_email gms) }
  
  has_many :runs
end
