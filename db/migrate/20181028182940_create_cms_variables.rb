class CreateCmsVariables < ActiveRecord::Migration[5.2]
  def change
    create_table :cms_variables do |t|
      t.references :convention, foreign_key: true, null: false
      t.text :key, null: false
      t.text :value
      t.index [:convention_id, :key], unique: true

      t.timestamps
    end
  end
end
