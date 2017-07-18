class CreateCmsNavigationItems < ActiveRecord::Migration[5.1]
  def change
    create_table :cms_navigation_items do |t|
      t.text :title
      t.references :parent, polymorphic: true
      t.references :navigation_section, foreign_key: { to_table: 'cms_navigation_items' }
      t.references :page, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
