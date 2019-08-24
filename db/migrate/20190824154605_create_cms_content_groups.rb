class CreateCmsContentGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :cms_content_groups do |t|
      t.string :name, null: false
      t.references :parent, polymorphic: true

      t.timestamps
    end

    add_reference :permissions, :cms_content_group, null: true, foreign_key: true

    remove_check_constraint :permissions, :permissions_model_exclusive_arc, <<~SQL
      (
        (convention_id is not null)::integer +
        (event_category_id is not null)::integer
      ) IN (0, 1)
    SQL

    add_check_constraint :permissions, :permissions_model_exclusive_arc, <<~SQL
      (
        (
          (cms_content_group_id IS NOT NULL)::integer +
          (convention_id IS NOT NULL)::integer +
          (event_category_id IS NOT NULL)::integer
        ) = ANY (ARRAY[0, 1])
      )
    SQL
  end
end
