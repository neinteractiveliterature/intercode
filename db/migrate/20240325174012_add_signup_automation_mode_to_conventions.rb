class AddSignupAutomationModeToConventions < ActiveRecord::Migration[7.1]
  def change
    add_column :conventions, :signup_automation_mode, :string

    reversible { |dir| dir.up { Convention.update_all(signup_automation_mode: "none") } }

    change_column_null :conventions, :signup_automation_mode, true
  end
end
