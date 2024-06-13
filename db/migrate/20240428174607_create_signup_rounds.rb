class CreateSignupRounds < ActiveRecord::Migration[7.1]
  def change
    create_table :signup_rounds do |t|
      t.references :convention, null: false, foreign_key: true
      t.timestamp :start
      t.text :maximum_event_signups, null: false

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        select_result = ActiveRecord::Base.connection.select_rows(<<~SQL)
          SELECT id, maximum_event_signups FROM conventions
        SQL

        maximum_event_signups_by_convention_id =
          select_result.to_h.transform_values { |json| JSON.parse(json).fetch("timespans") }
        signup_rounds =
          maximum_event_signups_by_convention_id.flat_map do |convention_id, timespans|
            timespans.map do |timespan|
              { convention_id:, start: timespan.fetch("start"), maximum_event_signups: timespan.fetch("value") }
            end
          end
        SignupRound.insert_all!(signup_rounds)
      end

      dir.down do
        select_result = ActiveRecord::Base.connection.select_rows(<<~SQL)
          SELECT convention_id, start, maximum_event_signups FROM signup_rounds
        SQL

        maximum_event_signups_by_convention_id =
          select_result
            .group_by { |row| row[0] }
            .transform_values do |rows|
              sorted_rows = rows.sort_by { |row| row[1] || Time.at(0) }
              timespans =
                sorted_rows.each_cons(2).map { |(row, next_row)| { start: row[1], value: row[2], finish: next_row[1] } }
              timespans << { start: sorted_rows.last[1], value: sorted_rows.last[2], finish: nil }

              { timespans: }
            end

        maximum_event_signups_by_convention_id.each do |convention_id, maximum_event_signups|
          ActiveRecord::Base.connection.execute <<~SQL
            UPDATE conventions
            SET maximum_event_signups = #{ActiveRecord::Base.connection.quote maximum_event_signups.to_json}::jsonb
            WHERE id = #{ActiveRecord::Base.connection.quote convention_id}
          SQL
        end
      end
    end

    remove_column :conventions, :maximum_event_signups, :jsonb
  end
end
