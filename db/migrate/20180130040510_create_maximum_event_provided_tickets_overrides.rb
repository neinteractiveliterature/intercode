class CreateMaximumEventProvidedTicketsOverrides < ActiveRecord::Migration[5.1]
  def change
    create_table :maximum_event_provided_tickets_overrides do |t|
      t.references :event, foreign_key: true
      t.references :ticket_type, foreign_key: true
      t.integer :override_value

      t.timestamps
    end
  end
end
