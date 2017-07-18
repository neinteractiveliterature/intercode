class CreateCmsPartials < ActiveRecord::Migration[5.1]
  def change
    create_table :cms_partials do |t|
      t.references :convention, null: false
      t.string :identifier, null: false
      t.text :content

      t.timestamps
    end

    add_index :cms_partials, [:convention_id, :identifier], unique: true
  end
end
