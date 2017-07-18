class CreateRoomsRuns < ActiveRecord::Migration[5.1]
  def change
    create_table :rooms_runs, id: false do |t|
      t.references :room, null: false, index: true, foreign_key: true
      t.references :run, null: false, index: true, foreign_key: true
    end

    add_index :rooms_runs, [:run_id, :room_id], unique: true
  end
end
