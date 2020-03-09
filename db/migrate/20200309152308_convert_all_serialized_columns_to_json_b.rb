class ConvertAllSerializedColumnsToJSONB < ActiveRecord::Migration[6.0]
  JSON_COLUMNS = {
    cms_variables: [:value],
    conventions: [:maximum_event_signups],
    event_proposals: [:registration_policy, :timeblock_preferences, :additional_info],
    events: [:registration_policy, :additional_info],
    form_items: [:properties, :default_value],
    form_response_changes: [:previous_value, :new_value],
    products: [:payment_options],
    ticket_types: [:pricing_schedule],
    user_con_profiles: [:additional_info]
  }

  def up
    JSON_COLUMNS.each do |(table_name, column_names)|
      alter_column_clauses = column_names.map do |column_name|
        quoted_column_name = connection.quote_column_name column_name
        <<~SQL
          ALTER COLUMN #{quoted_column_name} TYPE jsonb USING #{quoted_column_name}::jsonb
        SQL
      end
      execute <<~SQL
        ALTER TABLE #{connection.quote_table_name table_name}
        #{alter_column_clauses.join(', ')};
      SQL
    end
  end

  def down
    JSON_COLUMNS.each do |(table_name, column_names)|
      alter_column_clauses = column_names.map do |column_name|
        quoted_column_name = connection.quote_column_name column_name
        <<~SQL
          ALTER COLUMN #{quoted_column_name} TYPE text USING #{quoted_column_name}::text
        SQL
      end
      execute <<~SQL
        ALTER TABLE #{connection.quote_table_name table_name}
        #{alter_column_clauses.join(', ')};
      SQL
    end
  end
end
