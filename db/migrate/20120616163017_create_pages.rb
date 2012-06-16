class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.text :name
      t.string :slug
      t.text :content
      t.integer :parent_id
      t.string :parent_type

      t.timestamps
    end
    
    add_index :pages, [:parent_type, :parent_id, :slug], :unique => true
  end
end
