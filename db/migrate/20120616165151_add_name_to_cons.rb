class AddNameToCons < ActiveRecord::Migration
  def change
    change_table :cons do |t|
      t.string :name
    end
  end
end
