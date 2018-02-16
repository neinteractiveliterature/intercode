class AddAllowsEventSignupsToTicketTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :ticket_types, :allows_event_signups, :boolean, default: true, null: false
  end
end
