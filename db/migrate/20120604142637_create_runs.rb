class CreateRuns < ActiveRecord::Migration
  def change
    create_table :runs do |t|
      t.references :event
      t.timestamp :starts_at
      t.string :title_suffix
      t.text :schedule_note
      t.references :updated_by

      t.timestamps
    end
    
    add_index :runs, :event_id
    add_index :runs, :updated_by_id
  end
end
