class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.string :title
      t.string :author
      t.string :email
      t.string :organization
      t.text :url
      t.boolean :notify_on_changes
      t.text :player_constraints
      t.integer :length_seconds
      t.boolean :can_play_concurrently
      t.text :special_event_flags
      t.string :con_mail_destination
      t.text :description
      t.text :short_blurb
      t.references :updated_by

      t.timestamps
    end

    add_index :events, :updated_by_id
  end
end
