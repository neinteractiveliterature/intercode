class MakeTicketTypeNameNotNullable < ActiveRecord::Migration[6.0]
  def change
    change_column_null :ticket_types, :name, false
  end
end
