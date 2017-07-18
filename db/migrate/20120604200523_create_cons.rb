class CreateCons < ActiveRecord::Migration[5.1]
  def change
    create_table :cons do |t|
      t.string :signups_allowed, :null => false, :default => "not_yet"
      t.string :show_schedule, :null => false, :default => "no"
      t.text :news
      t.text :con_com_meetings
      t.boolean :accepting_bids
      t.boolean :precon_bids_allowed
      t.references :updated_by

      t.timestamps
    end

    add_index :cons, :updated_by_id
  end
end
