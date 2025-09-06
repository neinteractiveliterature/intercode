class AddAutomationActionToSignupRounds < ActiveRecord::Migration[8.0]
  def change
    add_column :signup_rounds, :automation_action, :text

    reversible { |dir| dir.up { execute <<~SQL } }
          UPDATE signup_rounds SET automation_action = 'execute_ranked_choice'
          FROM conventions
          WHERE signup_rounds.convention_id = conventions.id
          AND conventions.signup_automation_mode = 'ranked_choice'
        SQL
  end
end
