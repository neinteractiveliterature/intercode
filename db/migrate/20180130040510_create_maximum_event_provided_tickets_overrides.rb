class CreateMaximumEventProvidedTicketsOverrides < ActiveRecord::Migration[5.1]
  def change
    create_table :maximum_event_provided_tickets_overrides do |t|
      t.references :event, foreign_key: true, index: { name: 'idx_max_event_provided_tickets_on_event_id' }
      t.references :ticket_type, foreign_key: true, index: { name: 'idx_max_event_provided_tickets_on_ticket_type_id' }
      t.integer :override_value

      t.timestamps
    end
  end
end
