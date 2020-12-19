class AddConventionIdToPermissions < ActiveRecord::Migration[5.2]
  def change
    add_reference :permissions, :convention, null: true, foreign_key: true

    reversible do |dir|
      dir.up do
        execute 'ALTER TABLE permissions DROP CONSTRAINT permissions_model_exclusive_arc'
        execute <<~SQL
          ALTER TABLE permissions ADD CONSTRAINT permissions_model_exclusive_arc
          CHECK (
            (
              (convention_id is not null)::integer +
              (event_category_id is not null)::integer
            ) IN (0, 1)
          )
        SQL
      end

      dir.down do
        execute 'ALTER TABLE permissions DROP CONSTRAINT permissions_model_exclusive_arc'
        execute <<~SQL
          ALTER TABLE permissions ADD CONSTRAINT permissions_model_exclusive_arc
          CHECK (
            (
              (event_category_id is not null)::integer
            ) IN (0, 1)
          )
        SQL
      end
    end
  end
end
