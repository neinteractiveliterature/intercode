class AddTicketNameToConventions < ActiveRecord::Migration[5.1]
  def change
    add_column :conventions, :ticket_name, :string, null: false, default: 'ticket'
  end
end
