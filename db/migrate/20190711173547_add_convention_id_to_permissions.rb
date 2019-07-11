class AddConventionIdToPermissions < ActiveRecord::Migration[5.2]
  def change
    add_reference :permissions, :convention, null: true, foreign_key: true

    remove_check_constraint :permissions, 'permissions_model_exclusive_arc', <<~SQL
      (
        (event_category_id is not null)::integer
      ) IN (0, 1)
    SQL

    add_check_constraint :permissions, 'permissions_model_exclusive_arc', <<~SQL
      (
        (convention_id is not null)::integer +
        (event_category_id is not null)::integer
      ) IN (0, 1)
    SQL
  end
end
