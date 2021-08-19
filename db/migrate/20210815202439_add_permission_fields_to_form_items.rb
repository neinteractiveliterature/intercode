class AddPermissionFieldsToFormItems < ActiveRecord::Migration[6.1]
  def change
    add_column :form_items, :visibility, :string, default: 'normal', null: false
    add_column :form_items, :writeability, :string, default: 'normal', null: false

    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE form_items SET
            visibility = 'confirmed_attendee',
            properties = properties - 'hide_from_public'
          WHERE properties->'hide_from_public' = 'true'::jsonb
        SQL
      end

      dir.down do
        execute <<~SQL
          UPDATE form_items SET properties = properties || '{"hide_from_public": true}'::jsonb
          WHERE visibility != 'normal'
        SQL
      end
    end
  end
end
