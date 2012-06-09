class AddStartAndEndTimesToCons < ActiveRecord::Migration
  def change
    change_table :cons do |t|
      t.datetime :starts_at
      t.datetime :ends_at
    end
  end
end
