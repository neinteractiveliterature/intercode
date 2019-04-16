class AddTicketModeToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :ticket_mode, :string, default: 'disabled', null: false

    reversible do |dir|
      dir.up { execute "UPDATE conventions SET ticket_mode = 'required_for_signup'" }
    end
  end
end
