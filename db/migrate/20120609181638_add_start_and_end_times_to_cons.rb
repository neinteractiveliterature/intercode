class AddStartAndEndTimesToCons < ActiveRecord::Migration[5.1]
  def change
    change_table :cons do |t|
      t.datetime :starts_at
      t.datetime :ends_at
    end
  end
end
