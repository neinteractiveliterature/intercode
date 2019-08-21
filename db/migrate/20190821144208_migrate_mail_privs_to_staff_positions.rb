class MigrateMailPrivsToStaffPositions < ActiveRecord::Migration[5.2]
  PERMISSION_MAP = {
    'mail_to_attendees' => 'read_user_con_profiles_mailing_list',
    'mail_to_gms' => 'read_team_members_mailing_list'
  }

  def up
    Convention.find_each do |convention|
      mail_privs = %w[gms attendees].map { |group| "mail_to_#{group}" }
      sql_clauses = mail_privs.map { |priv_name| "#{priv_name} = ?" }
      mail_profiles = convention.user_con_profiles
        .where(sql_clauses.join(' OR '), *sql_clauses.map { |_clause| true })

      if mail_profiles.none?
        say "No functional mail profiles for #{convention.name}; skipping"
        next
      end

      profiles_by_priv_set = mail_profiles.group_by do |user_con_profile|
        mail_privs.select { |priv_name| user_con_profile.public_send("#{priv_name}?") }.sort
      end

      profiles_by_priv_set.each do |priv_set, user_con_profiles|
        staff_position_name = "Mail to #{priv_set.map { |priv| priv.gsub('mail_to_', '') }.to_sentence}"
        say "Migrating #{staff_position_name.downcase} profiles for #{convention.name}"

        permissions = priv_set.map { |priv| PERMISSION_MAP.fetch(priv) }

        staff_position = convention.staff_positions.create!(
          name: staff_position_name, visible: false, user_con_profile_ids: user_con_profiles.map(&:id)
        )
        permissions.each do |permission|
          staff_position.permissions.create!(model: convention, permission: permission)
        end
      end
    end

    priv_columns = %w[gms attendees vendors unpaid alumni].map { |group| "mail_to_#{group}" }
    priv_columns.each do |column|
      remove_column :user_con_profiles, column.to_sym, default: false, null: false
    end
  end
end
