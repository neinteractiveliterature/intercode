# frozen_string_literal: true
class AddBucketIdToSignupsSignupRequestsSignupRankedChoicesAndSignupChanges < ActiveRecord::Migration[8.1]
  def change
    add_reference :signups, :bucket, foreign_key: { to_table: :registration_policy_buckets }
    add_reference :signups, :requested_bucket, foreign_key: { to_table: :registration_policy_buckets }

    add_reference :signup_requests, :requested_bucket, foreign_key: { to_table: :registration_policy_buckets }

    add_reference :signup_ranked_choices, :requested_bucket, foreign_key: { to_table: :registration_policy_buckets }

    add_reference :signup_changes, :bucket, foreign_key: { to_table: :registration_policy_buckets, on_delete: :nullify }
    add_column :signup_changes, :bucket_name, :string
    add_reference :signup_changes,
                  :requested_bucket,
                  foreign_key: {
                    to_table: :registration_policy_buckets,
                    on_delete: :nullify
                  }
    add_column :signup_changes, :requested_bucket_name, :string

    reversible { |dir| dir.up { backfill_bucket_ids } }
  end

  private

  def backfill_bucket_ids
    backfill_via_run("signups", "run_id", "bucket_key", "bucket_id")
    backfill_via_run("signups", "run_id", "requested_bucket_key", "requested_bucket_id")
    backfill_via_run("signup_requests", "target_run_id", "requested_bucket_key", "requested_bucket_id")
    backfill_via_run("signup_ranked_choices", "target_run_id", "requested_bucket_key", "requested_bucket_id")
    backfill_via_run("signup_changes", "run_id", "bucket_key", "bucket_id", name_column: "bucket_name")
    backfill_via_run(
      "signup_changes",
      "run_id",
      "requested_bucket_key",
      "requested_bucket_id",
      name_column: "requested_bucket_name"
    )
  end

  def backfill_via_run(table, run_column, key_column, id_column, name_column: nil)
    name_assignment = name_column ? ", #{name_column} = rpb.name" : ""

    execute <<~SQL.squish
      UPDATE #{table}
      SET #{id_column} = rpb.id#{name_assignment}
      FROM runs
      JOIN events ON events.id = runs.event_id
      JOIN registration_policy_buckets rpb ON rpb.registration_policy_id = events.registration_policy_id
      WHERE runs.id = #{table}.#{run_column}
        AND rpb.key = #{table}.#{key_column}
        AND #{table}.#{key_column} IS NOT NULL
    SQL
  end
end
