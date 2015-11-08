class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.references :convention, index: true, foreign_key: true
      t.string :name

      t.timestamps null: false
    end
  end
end
