class CreateRooms < ActiveRecord::Migration[4.2]
  def change
    create_table :rooms do |t|
      t.references :convention, index: true, foreign_key: true
      t.string :name

      t.timestamps null: false
    end
  end
end
