class AddCountedToSignups < ActiveRecord::Migration[5.1]
  def change
    add_column :signups, :counted, :boolean
  end
end
