class AddTimestampsToOrders < ActiveRecord::Migration[5.1]
  def change
    add_column :orders, :submitted_at, :timestamp
    add_column :orders, :paid_at, :timestamp
  end
end
