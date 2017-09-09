class CreateAwayBlocks < ActiveRecord::Migration[5.1]
  def change
    create_table :away_blocks do |t|
      t.references :user_con_profile, foreign_key: true
      t.timestamp :start
      t.timestamp :finish

      t.timestamps
    end
  end
end
