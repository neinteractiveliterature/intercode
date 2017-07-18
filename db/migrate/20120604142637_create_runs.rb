class CreateRuns < ActiveRecord::Migration[5.1]
  def change
    create_table :runs do |t|
      t.references :event
      t.timestamp :starts_at
      t.string :title_suffix
      t.text :schedule_note
      t.references :updated_by

      t.timestamps
    end
  end
end
