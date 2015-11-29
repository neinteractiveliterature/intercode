class AddProvidedByEventToTickets < ActiveRecord::Migration
  def change
    add_reference :tickets, :provided_by_event, index: true
    add_foreign_key :tickets, :events, column: :provided_by_event_id
  end
end
