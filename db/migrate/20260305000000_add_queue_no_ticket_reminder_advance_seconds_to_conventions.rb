class AddQueueNoTicketReminderAdvanceSecondsToConventions < ActiveRecord::Migration[8.1]
  def change
    add_column :conventions, :queue_no_ticket_reminder_advance_seconds, :integer
  end
end
