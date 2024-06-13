class CreateRankedChoiceDecisions < ActiveRecord::Migration[7.1]
  def change
    create_table :ranked_choice_decisions do |t|
      t.references :user_con_profile, null: true, foreign_key: true
      t.references :signup_ranked_choice, null: true, foreign_key: true
      t.text :decision, null: false
      t.text :reason
      t.references :signup, null: true, foreign_key: true
      t.references :signup_request, null: true, foreign_key: true
      t.jsonb :extra, null: true

      t.timestamps
    end
  end
end
