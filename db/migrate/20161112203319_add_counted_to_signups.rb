class AddCountedToSignups < ActiveRecord::Migration[5.0]
  def change
    add_column :signups, :counted, :boolean
  end
end
