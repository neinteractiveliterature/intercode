class AddMaximumTicketsToConventions < ActiveRecord::Migration[5.1]
  def change
    add_column :conventions, :maximum_tickets, :integer
  end
end
