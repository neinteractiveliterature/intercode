class CreateCmsFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :cms_files do |t|
      t.references :convention, foreign_key: true
      t.references :uploader, foreign_key: { to_table: :users }
      t.string :file, null: false

      t.timestamps
    end

    add_index :cms_files, [:convention_id, :file], unique: true
  end
end
