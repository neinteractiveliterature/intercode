class AddTrigramExtension < ActiveRecord::Migration[6.0]
  def up
    execute 'CREATE EXTENSION IF NOT EXISTS pg_trgm'
  end

  def down
    execute 'DROP EXTENSION pg_trgm'
  end
end
