class AddMaximumEventProvidedTicketsToTicketTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :ticket_types, :maximum_event_provided_tickets, :integer, null: false, default: 0
  end
end
