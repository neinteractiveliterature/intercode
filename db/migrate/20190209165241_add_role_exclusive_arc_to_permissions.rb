class AddRoleExclusiveArcToPermissions < ActiveRecord::Migration[5.2]
  def change
    change_column_null :permissions, :staff_position_id, true
    add_reference :permissions, :organization_role, null: true, foreign_key: true

    reversible do |dir|
      dir.up do
        execute <<~SQL
        ALTER TABLE permissions ADD CONSTRAINT permissions_role_exclusive_arc
        CHECK (
          (
            (staff_position_id is not null)::integer
            + (organization_role_id is not null)::integer
          ) = 1
        )
        SQL

        # Rename model arc and make model optional
        execute 'ALTER TABLE permissions DROP CONSTRAINT permissions_exclusive_arc'

        execute <<~SQL
        ALTER TABLE permissions ADD CONSTRAINT permissions_model_exclusive_arc
        CHECK (
          (
            (event_category_id is not null)::integer
          ) IN (0, 1)
        )
        SQL
      end

      dir.down do
        execute 'ALTER TABLE PERMISSIONS DROP CONSTRAINT permissions_model_exclusive_arc'
        execute <<~SQL
        ALTER TABLE permissions ADD CONSTRAINT permissions_exclusive_arc CHECK ((
          (event_category_id is not null)::integer
        ) = 1)
        SQL
        execute 'ALTER TABLE PERMISSIONS DROP CONSTRAINT permissions_role_exclusive_arc'
      end
    end
  end
end
