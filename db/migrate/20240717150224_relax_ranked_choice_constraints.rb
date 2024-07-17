class RelaxRankedChoiceConstraints < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :ranked_choice_decisions, :signups
    remove_foreign_key :ranked_choice_decisions, :signup_requests
    remove_foreign_key :ranked_choice_decisions, :signup_ranked_choices

    add_foreign_key :ranked_choice_decisions, :signups, on_delete: :nullify
    add_foreign_key :ranked_choice_decisions, :signup_requests, on_delete: :nullify
    add_foreign_key :ranked_choice_decisions, :signup_ranked_choices, on_delete: :nullify
  end
end
