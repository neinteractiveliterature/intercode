class ScopeEventsToCon < ActiveRecord::Migration[5.1]
  def change
    change_table :events do |t|
      t.references :con
      t.index :con_id
    end
  end
end
