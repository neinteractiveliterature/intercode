class Signup < ActiveRecord::Base
  belongs_to :user
  belongs_to :run
  has_one :event, through: :run
  belongs_to :updated_by, class_name: "User"
end
