class CreateFormItems < ActiveRecord::Migration[5.1]
  def change
    create_table :form_items do |t|
      t.references :form_section, foreign_key: true
      t.integer :position
      t.text :identifier
      t.text :item_type
      t.text :properties

      t.timestamps
    end
  end
end
