class CreateProductVariants < ActiveRecord::Migration[5.1]
  def change
    create_table :product_variants do |t|
      t.references :product, foreign_key: true
      t.text :name
      t.text :description
      t.string :image
      t.integer :override_price_cents
      t.string :override_price_currency

      t.timestamps
    end
  end
end
