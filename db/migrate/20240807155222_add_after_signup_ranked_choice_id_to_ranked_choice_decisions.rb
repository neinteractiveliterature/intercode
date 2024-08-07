class AddAfterSignupRankedChoiceIdToRankedChoiceDecisions < ActiveRecord::Migration[7.1]
  def up
    add_reference :ranked_choice_decisions,
                  :after_signup_ranked_choice,
                  null: true,
                  foreign_key: {
                    to_table: :signup_ranked_choices,
                    on_delete: :nullify
                  }
  end

  def down
    remove_reference :ranked_choice_decisions, :after_signup_ranked_choice
  end
end
