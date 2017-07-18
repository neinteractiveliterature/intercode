class AddMaximumEventSignupsToConventions < ActiveRecord::Migration[5.1]
  def change
    add_column :conventions, :maximum_event_signups, :text
  end
end
