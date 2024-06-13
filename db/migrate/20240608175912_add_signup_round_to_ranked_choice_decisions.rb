class AddSignupRoundToRankedChoiceDecisions < ActiveRecord::Migration[7.1]
  def change
    add_reference :ranked_choice_decisions, :signup_round, null: false, foreign_key: true # rubocop:disable Rails/NotNullColumn
  end
end
