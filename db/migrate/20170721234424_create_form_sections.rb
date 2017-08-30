class CreateFormSections < ActiveRecord::Migration[5.1]
  def change
    create_table :form_sections do |t|
      t.references :form, foreign_key: true
      t.text :title
      t.integer :position

      t.timestamps
    end
  end
end
