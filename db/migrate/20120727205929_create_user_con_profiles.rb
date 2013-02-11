require 'app/models/user_con_profile'

class CreateUserConProfiles < ActiveRecord::Migration
  def change
    create_table :user_con_profiles do |t|
      t.references :user, :null => false
      t.references :con, :null => false

      t.string :registration_status, :null => false, :default => "unpaid"
      t.references :comp_event
      t.integer :payment_amount_cents
      t.string :payment_amount_currency, :length => 3
      t.text :payment_note

      UserConProfile::PRIV_NAMES.each do |priv_name|
        t.boolean priv_name, :null => false, :default => false
      end

      t.timestamps
    end

    add_index :user_con_profiles, [:con_id, :user_id], :unique => true
    add_index :user_con_profiles, :registration_status
  end
end
