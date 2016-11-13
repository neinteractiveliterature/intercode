class ScopeEventsToCon < ActiveRecord::Migration[4.2]
  def change
    change_table :events do |t|
      t.references :con
      t.index :con_id
    end
  end
end
