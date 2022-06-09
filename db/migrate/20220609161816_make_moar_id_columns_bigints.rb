class MakeMoarIdColumnsBigints < ActiveRecord::Migration[7.0]
  COLUMNS = {
    cms_files: %w[id parent_id],
    cms_partials: %w[id parent_id],
    oauth_access_grants: %w[resource_owner_id],
    oauth_access_tokens: %w[resource_owner_id],
    pages: %w[parent_id],
    sessions: %w[id],
    team_members: %w[id updated_by_id],
    tickets: %w[id]
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
