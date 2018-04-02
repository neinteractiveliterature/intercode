class CreateOrderEntries < ActiveRecord::Migration[5.1]
  def change
    create_table :order_entries do |t|
      t.references :order, foreign_key: true, null: false
      t.references :product, foreign_key: true, null: false
      t.references :product_variant, foreign_key: true
      t.integer :quantity
      t.integer :price_per_item_cents
      t.string :price_per_item_currency

      t.timestamps
    end
  end
end
