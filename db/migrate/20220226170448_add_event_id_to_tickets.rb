class AddEventIdToTickets < ActiveRecord::Migration[7.0]
  def change
    add_reference :tickets, :event, null: true, foreign_key: true
  end
end
