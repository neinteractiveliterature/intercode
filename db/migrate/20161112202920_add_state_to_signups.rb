class AddStateToSignups < ActiveRecord::Migration[5.0]
  def change
    add_column :signups, :state, :string, null: false, default: 'confirmed', index: true
  end
end
