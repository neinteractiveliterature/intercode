class MakeIdColumnsBigints < ActiveRecord::Migration[7.0]
  COLUMNS = {
    cms_files: %w[uploader_id],
    conventions: %w[id updated_by_id root_page_id],
    events: %w[id updated_by_id owner_id convention_id],
    maximum_event_provided_tickets_overrides: %w[ticket_type_id],
    notification_destinations: %w[staff_position_id],
    pages: %w[id],
    permissions: %w[staff_position_id],
    products: %w[provides_ticket_type_id],
    rooms: %w[id convention_id],
    rooms_runs: %w[room_id run_id],
    root_sites: %w[root_page_id],
    runs: %w[id updated_by_id event_id],
    signup_changes: %w[signup_id],
    signup_requests: %w[result_signup_id replace_signup_id],
    signups: %w[id user_con_profile_id updated_by_id run_id],
    staff_positions: %w[id convention_id],
    team_members: %w[event_id user_con_profile_id],
    ticket_types: %w[id convention_id],
    tickets: %w[user_con_profile_id provided_by_event_id ticket_type_id],
    users: %w[id],
    user_con_profiles: %w[id user_id convention_id]
  }

  def up
    COLUMNS.each do |table, columns|
      alters = columns.map { |col| "ALTER COLUMN #{col} TYPE bigint" }
      execute <<~SQL
      ALTER TABLE #{table} #{alters.join(', ')};
      SQL
    end
  end

  def down
    COLUMNS.each do |table, columns|
      alters = columns.map { |col| "ALTER COLUMN #{col} TYPE integer" }
      execute <<~SQL
      ALTER TABLE #{table} #{alters.join(', ')};
      SQL
    end
  end
end
