class ScopeEventsToCon < ActiveRecord::Migration
  def change
    change_table :events do |t|
      t.references :con
      t.index :con_id
    end
  end
end
