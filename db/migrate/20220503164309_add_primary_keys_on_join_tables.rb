class AddPrimaryKeysOnJoinTables < ActiveRecord::Migration[7.0]
  JOIN_TABLES = {
    cms_files_layouts: %w[cms_file_id cms_layout_id],
    cms_files_pages: %w[cms_file_id page_id],
    cms_layouts_partials: %w[cms_layout_id cms_partial_id],
    cms_partials_pages: %w[cms_partial_id page_id],
    organization_roles_users: %w[organization_role_id user_id],
    rooms_runs: %w[room_id run_id],
    staff_positions_user_con_profiles: %w[staff_position_id user_con_profile_id]
  }

  def up
    execute <<~SQL
    DELETE   FROM staff_positions_user_con_profiles T1
    USING       staff_positions_user_con_profiles T2
    WHERE  T1.ctid    < T2.ctid
    AND  T1.staff_position_id = T2.staff_position_id
    AND  T1.user_con_profile_id = T2.user_con_profile_id;
    SQL

    JOIN_TABLES.each { |table, columns| execute <<~SQL }
      ALTER TABLE #{table} ADD PRIMARY KEY (#{columns.join(', ')});
      SQL
  end

  def down
    JOIN_TABLES.each { |table, _columns| execute <<~SQL }
      ALTER TABLE #{table} DROP PRIMARY KEY;
      SQL
  end
end
