class CreateEventProposalChanges < ActiveRecord::Migration[5.1]
  def change
    create_table :event_proposal_changes do |t|
      t.references :event_proposal, foreign_key: true, null: false
      t.references :user_con_profile, foreign_key: true, null: false
      t.string :field_identifier, null: false
      t.text :previous_value
      t.text :new_value
      t.datetime :notified_at

      t.timestamps
    end
  end
end
