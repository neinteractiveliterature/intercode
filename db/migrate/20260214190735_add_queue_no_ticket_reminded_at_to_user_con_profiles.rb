class AddQueueNoTicketRemindedAtToUserConProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :user_con_profiles, :queue_no_ticket_reminded_at, :datetime
  end
end
