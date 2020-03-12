class CreateEmailRoutes < ActiveRecord::Migration[6.0]
  def change
    create_table :email_routes do |t|
      t.text :receiver_address, null: false, index: { unique: true }
      t.text :forward_addresses, null: false, array: true
      t.timestamps
    end
  end
end
