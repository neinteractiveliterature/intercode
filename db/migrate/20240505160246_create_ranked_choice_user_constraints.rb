class CreateRankedChoiceUserConstraints < ActiveRecord::Migration[7.1]
  def change
    create_table :ranked_choice_user_constraints do |t|
      t.references :user_con_profile, null: false, foreign_key: true
      t.timestamp :start
      t.timestamp :finish
      t.integer :maximum_signups, null: false

      t.timestamps
    end
  end
end
