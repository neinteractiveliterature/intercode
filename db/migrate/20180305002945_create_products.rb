class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.references :convention, foreign_key: true
      t.boolean :available
      t.text :name
      t.text :description
      t.string :image
      t.integer :price_cents
      t.string :price_currency

      t.timestamps
    end
  end
end
