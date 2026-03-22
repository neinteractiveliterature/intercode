class AddBucketKeyNullConstraintToSignups < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL
      ALTER TABLE signups
        ADD CONSTRAINT bucket_key_null_for_non_slot_occupying_states
        CHECK (bucket_key IS NULL OR state IN ('confirmed', 'ticket_purchase_hold'))
    SQL
  end

  def down
    execute <<~SQL
      ALTER TABLE signups
        DROP CONSTRAINT bucket_key_null_for_non_slot_occupying_states
    SQL
  end
end
