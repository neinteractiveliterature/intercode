class AddPubliclyAvailableAndCountsTowardsConventionMaximumToTicketTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :ticket_types, :publicly_available, :boolean, null: false, default: true
    add_column :ticket_types, :counts_towards_convention_maximum, :boolean, null: false, default: true
  end
end
