class ChangeEventIdToRunIdInTickets < ActiveRecord::Migration[7.0]
  def change
    add_reference :tickets, :run, null: true, foreign_key: true

    reversible do |dir|
      dir.up { execute <<~SQL }
          UPDATE tickets
          SET run_id = runs.id
          FROM runs
          WHERE runs.event_id = tickets.event_id AND tickets.event_id IS NOT NULL
        SQL

      dir.down { execute <<~SQL }
          UPDATE tickets
          SET event_id = runs.event_id
          FROM runs
          WHERE runs.run_id = tickets.run_id AND tickets.run_id IS NOT NULL
        SQL
    end

    remove_reference :tickets, :event, null: true, foreign_key: true
  end
end
