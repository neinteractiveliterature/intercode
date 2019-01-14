class CreatePermissions < ActiveRecord::Migration[5.2]
  def change
    create_table :permissions do |t|
      t.references :event_category, null: true, foreign_key: true
      t.references :staff_position, null: false, foreign_key: true
      t.string :permission, null: false
      t.index [
        :staff_position_id,
        :permission,
        :event_category_id
      ], unique: true, name: 'idx_permissions_unique_join'

      t.check_constraint 'permissions_exclusive_arc', <<~SQL
        (
          (event_category_id is not null)::integer
        ) = 1
      SQL

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        autogenerate_hidden_staff_positions_for_privilege 'proposal_chair'
        grant_larp_permissions_to_privilege_holders(
          'proposal_chair',
          %w[
            read_event_proposals
            read_pending_event_proposals
            update_event_proposals
            access_admin_notes
            override_event_tickets
            update_events
          ]
        )

        autogenerate_hidden_staff_positions_for_privilege 'proposal_committee'
        grant_larp_permissions_to_privilege_holders(
          'proposal_committee',
          %w[read_event_proposals]
        )
      end

      dir.down do
        execute <<~SQL, 'Setting privilege values for users with proposal_chair permissions'
          UPDATE user_con_profiles
          SET
            proposal_chair = 't'
          WHERE user_con_profiles.id IN (
            SELECT DISTINCT staff_positions_user_con_profiles.user_con_profile_id
            FROM staff_positions_user_con_profiles
            INNER JOIN permissions
              ON permissions.staff_position_id = staff_positions_user_con_profiles.staff_position_id
            INNER JOIN event_categories
              ON event_categories.id = permissions.event_category_id
            INNER JOIN user_con_profiles
              ON user_con_profiles.id = staff_positions_user_con_profiles.user_con_profile_id
            WHERE
              event_categories.name = 'Larp'
              AND user_con_profiles.staff = 'f'
              AND EXISTS (
                SELECT 1
                FROM permissions
                WHERE permissions.permission = 'read_event_proposals'
                  AND permissions.staff_position_id = staff_positions_user_con_profiles.staff_position_id
              )
              AND EXISTS (
                SELECT 1
                FROM permissions
                WHERE permissions.permission = 'read_pending_event_proposals'
                  AND permissions.staff_position_id = staff_positions_user_con_profiles.staff_position_id
              )
              AND EXISTS (
                SELECT 1
                FROM permissions
                WHERE permissions.permission = 'update_event_proposals'
                  AND permissions.staff_position_id = staff_positions_user_con_profiles.staff_position_id
              )
          )
        SQL

        execute <<~SQL, 'Setting privilege values for users with proposal_committee permissions'
          UPDATE user_con_profiles
          SET
            proposal_committee = 't'
          WHERE user_con_profiles.id IN (
            SELECT DISTINCT staff_positions_user_con_profiles.user_con_profile_id
            FROM staff_positions_user_con_profiles
            INNER JOIN permissions
              ON permissions.staff_position_id = staff_positions_user_con_profiles.staff_position_id
            INNER JOIN event_categories
              ON event_categories.id = permissions.event_category_id
            INNER JOIN user_con_profiles
              ON user_con_profiles.id = staff_positions_user_con_profiles.user_con_profile_id
            WHERE
              event_categories.name = 'Larp'
              AND user_con_profiles.staff = 'f'
              AND user_con_profiles.proposal_chair = 'f'
              AND EXISTS (
                SELECT 1
                FROM permissions
                WHERE permissions.permission = 'read_event_proposals'
                  AND permissions.staff_position_id = staff_positions_user_con_profiles.staff_position_id
              )
          )
        SQL
      end
    end

    remove_column :user_con_profiles, "proposal_committee", :boolean, default: false, null: false
    remove_column :user_con_profiles, "proposal_chair", :boolean, default: false, null: false
  end

  private

  def autogenerate_hidden_staff_positions_for_privilege(privilege)
    unpositioned_profile_data = select_rows <<~SQL, "Finding #{privilege} profiles with no staff position"
      SELECT
        user_con_profiles.id,
        user_con_profiles.convention_id
      FROM user_con_profiles
      LEFT JOIN staff_positions_user_con_profiles
        ON staff_positions_user_con_profiles.user_con_profile_id = user_con_profiles.id
      LEFT JOIN staff_positions
        ON staff_positions_user_con_profiles.staff_position_id = staff_positions.id
      WHERE
        user_con_profiles.#{quote_column_name privilege} = 't'
        AND user_con_profiles.staff = 'f'
        AND staff_positions.id IS NULL
    SQL

    hidden_staff_positions_by_convention_id = {}
    unpositioned_profile_data.map(&:second).uniq.each do |convention_id|
      staff_position = StaffPosition.create!(
        convention_id: convention_id,
        name: "Autogenerated hidden #{privilege} position",
        visible: false
      )
      hidden_staff_positions_by_convention_id[convention_id] = staff_position
    end

    unpositioned_profile_data.each do |(user_con_profile_id, convention_id)|
      staff_position = hidden_staff_positions_by_convention_id[convention_id]
      insert <<~SQL, "Adding user con profile #{user_con_profile_id} to autogenerated staff position"
        INSERT INTO staff_positions_user_con_profiles (
          staff_position_id,
          user_con_profile_id
        ) VALUES (#{quote staff_position.id}, #{quote user_con_profile_id})
      SQL
    end
  end

  def grant_larp_permissions_to_privilege_holders(privilege, permissions)
    permissions.each do |permission|
      execute <<~SQL, "Granting permissions to staff positions containing #{privilege} profiles"
        INSERT INTO permissions (
          event_category_id,
          staff_position_id,
          permission,
          created_at,
          updated_at
        )
        SELECT
          event_categories.id,
          staff_positions.id,
          #{quote(permission)},
          NOW(),
          NOW()
        FROM user_con_profiles
        LEFT JOIN staff_positions_user_con_profiles
          ON staff_positions_user_con_profiles.user_con_profile_id = user_con_profiles.id
        LEFT JOIN staff_positions
          ON staff_positions_user_con_profiles.staff_position_id = staff_positions.id
        LEFT JOIN event_categories
          ON (
            event_categories.convention_id = user_con_profiles.convention_id
            AND event_categories.name = 'Larp'
          )
        WHERE
          user_con_profiles.#{quote_column_name privilege} = 't'
          AND user_con_profiles.staff = 'f'
          AND staff_positions.id IS NOT NULL
        ON CONFLICT DO NOTHING
      SQL
    end
  end
end
