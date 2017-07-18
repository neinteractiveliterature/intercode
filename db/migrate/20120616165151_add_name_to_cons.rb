class AddNameToCons < ActiveRecord::Migration[5.1]
  def change
    change_table :cons do |t|
      t.string :name
    end
  end
end
