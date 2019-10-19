class CreateEventRatings < ActiveRecord::Migration[6.0]
  def change
    create_table :event_ratings do |t|
      t.references :user_con_profile, null: false
      t.references :event, null: false
      t.integer :rating

      t.index [:user_con_profile_id, :event_id], unique: true
      t.timestamps
    end
  end
end
