class AddEventRatingsForeignKeys < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :event_ratings, :user_con_profiles
    add_foreign_key :event_ratings, :events
  end
end
