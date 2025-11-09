class EnforceRankedChoiceOrderForRankedChoiceSignupRounds < ActiveRecord::Migration[8.0]
  def change
    reversible { |dir| dir.up { execute <<~SQL } }
          UPDATE signup_rounds
          SET ranked_choice_order = 'asc'
          WHERE automation_action = 'execute_ranked_choice' AND ranked_choice_order IS NULL
        SQL

    add_check_constraint :signup_rounds,
                         "automation_action != 'execute_ranked_choice' OR ranked_choice_order IS NOT NULL",
                         name: "require_order_for_ranked_choice_rounds"
  end
end
