class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.references :user_con_profile, foreign_key: true, null: false
      t.string :status, null: false
      t.string :charge_id
      t.integer :payment_amount_cents
      t.string :payment_amount_currency
      t.text :payment_note

      t.timestamps
    end
  end
end
