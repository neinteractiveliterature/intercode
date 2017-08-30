class CreateEventProposals < ActiveRecord::Migration[5.1]
  def change
    create_table :event_proposals do |t|
      t.references :convention, foreign_key: true
      t.references :owner, foreign_key: { to_table: :user_con_profiles }
      t.references :event, foreign_key: true
      t.string :status
      t.text :title
      t.text :email
      t.integer :length_seconds
      t.text :description
      t.text :short_blurb
      t.text :registration_policy
      t.boolean :can_play_concurrently
      t.text :additional_info

      t.timestamps
    end
  end
end
