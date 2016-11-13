class AddStartAndEndTimesToCons < ActiveRecord::Migration[4.2]
  def change
    change_table :cons do |t|
      t.datetime :starts_at
      t.datetime :ends_at
    end
  end
end
