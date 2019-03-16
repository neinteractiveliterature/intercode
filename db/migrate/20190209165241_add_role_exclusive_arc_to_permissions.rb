class AddRoleExclusiveArcToPermissions < ActiveRecord::Migration[5.2]
  def change
    change_column_null :permissions, :staff_position_id, true
    add_reference :permissions, :organization_role, null: true, foreign_key: true

    add_check_constraint :permissions, 'permissions_role_exclusive_arc', <<~SQL
      (
        (staff_position_id is not null)::integer
        + (organization_role_id is not null)::integer
      ) = 1
    SQL

    # Rename model arc and make model optional
    remove_check_constraint :permissions, 'permissions_exclusive_arc', <<~SQL
      (
        (event_category_id is not null)::integer
      ) = 1
    SQL

    add_check_constraint :permissions, 'permissions_model_exclusive_arc', <<~SQL
      (
        (event_category_id is not null)::integer
      ) IN (0, 1)
    SQL
  end
end
