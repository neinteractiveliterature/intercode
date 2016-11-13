class CreateSignups < ActiveRecord::Migration[4.2]
  def change
    create_table :signups do |t|
      t.references :run, index: true, foreign_key: true
      t.string :bucket_key
      t.references :updated_by, index: true

      t.timestamps null: false
    end

    add_foreign_key :signups, :users, column: 'updated_by_id'
  end
end
