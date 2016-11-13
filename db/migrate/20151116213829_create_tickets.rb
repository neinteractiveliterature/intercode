class CreateTickets < ActiveRecord::Migration[4.2]
  def change
    create_table :tickets do |t|
      t.references :user_con_profile, index: true, foreign_key: true
      t.references :ticket_type, index: true, foreign_key: true
      t.string :charge_id, index: { unique: true }
      t.integer :payment_amount_cents
      t.string :payment_amount_currency
      t.text :payment_note

      t.timestamps null: false
    end
  end
end
