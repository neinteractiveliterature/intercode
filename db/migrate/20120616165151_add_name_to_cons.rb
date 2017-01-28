class AddNameToCons < ActiveRecord::Migration[4.2]
  def change
    change_table :cons do |t|
      t.string :name
    end
  end
end
