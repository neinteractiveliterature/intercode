class AddRankedChoiceOrderAndExecutedAtToSignupRounds < ActiveRecord::Migration[7.1]
  def change
    change_table :signup_rounds, bulk: true do |t|
      t.text :ranked_choice_order
      t.timestamp :executed_at
    end
  end
end
