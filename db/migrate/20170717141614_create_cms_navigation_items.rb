class CreateCmsNavigationItems < ActiveRecord::Migration[5.1]
  def change
    create_table :cms_navigation_items do |t|
      t.text :title
      t.references :parent, polymorphic: true
      t.references :navigation_section
      t.references :page
      t.integer :position

      t.timestamps
    end

    add_foreign_key :cms_navigation_sections, :pages
    add_foreign_key :cms_navigation_sections, :cms_navigation_sections, column: :navigation_section_id
  end
end
