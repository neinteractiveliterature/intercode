class CreateCmsContentGroupAssociations < ActiveRecord::Migration[5.2]
  def change
    create_table :cms_content_group_associations do |t|
      t.references :content, polymorphic: true, null: false,
        index: { name: 'index_cms_content_group_associations_on_content' }
      t.references :cms_content_group, foreign_key: true, null: false

      t.timestamps
    end
  end
end
