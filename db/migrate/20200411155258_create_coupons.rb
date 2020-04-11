class CreateCoupons < ActiveRecord::Migration[6.0]
  def change
    create_table :coupons do |t|
      t.references :convention, null: false, foreign_key: true
      t.text :code, null: false
      t.references :provides_product, null: true, foreign_key: { to_table: :products }
      t.integer :fixed_amount_cents
      t.string :fixed_amount_currency
      t.decimal :percent_discount
      t.integer :usage_limit
      t.timestamp :expires_at

      t.timestamps
    end

    add_index :coupons, [:convention_id, :code], unique: true
  end
end
