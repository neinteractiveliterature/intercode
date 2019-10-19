class EventRating < ApplicationRecord
  belongs_to :event
  belongs_to :user_con_profile
end
