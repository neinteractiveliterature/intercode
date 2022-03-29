class AddRunToOrderEntries < ActiveRecord::Migration[7.0]
  def change
    add_reference :order_entries, :run, null: true, foreign_key: true
  end
end
