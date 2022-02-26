class AddEventIdToTicketTypes < ActiveRecord::Migration[7.0]
  def change
    add_reference :ticket_types, :event, null: true, foreign_key: true

    reversible do |dir|
      dir.up { execute <<~SQL }
          ALTER TABLE ticket_types
          ADD CONSTRAINT ticket_types_parent_exclusive_arc
          CHECK (((convention_id IS NOT NULL)::integer + (event_id IS NOT NULL)::integer) = 1)
        SQL

      dir.down { execute <<~SQL }
          ALTER TABLE ticket_types
          DROP CONSTRAINT ticket_types_parent_exclusive_arc
        SQL
    end
  end
end
