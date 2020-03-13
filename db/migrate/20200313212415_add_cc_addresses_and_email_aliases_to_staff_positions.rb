class AddCcAddressesAndEmailAliasesToStaffPositions < ActiveRecord::Migration[6.0]
  def change
    change_table :staff_positions do |t|
      t.text :cc_addresses, array: true, null: false, default: []
      t.text :email_aliases, array: true, null: false, default: []
    end
  end
end
