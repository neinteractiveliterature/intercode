class AddBucketKeyNullConstraintToSignups < ActiveRecord::Migration[8.1]
  def up
    # Clear bucket_key on withdrawn/waitlisted signups that predate the fix in EventWithdrawService
    # (prior to March 2020, withdrawals did not null out bucket_key)
    execute <<~SQL
      UPDATE signups SET bucket_key = NULL
        WHERE state NOT IN ('confirmed', 'ticket_purchase_hold')
          AND bucket_key IS NOT NULL
    SQL

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
