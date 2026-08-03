# frozen_string_literal: true
# rubocop:disable Metrics/ClassLength
class ConvertRegistrationPoliciesToTables < ActiveRecord::Migration[8.1]
  SLOT_COUNT_TYPES = %w[minimum preferred total].freeze
  SLOT_COUNTED_TYPES = %w[all counted not_counted].freeze

  def change
    create_table :registration_policies do |t|
      t.boolean :prevent_no_preference_signups, null: false, default: false
      t.boolean :freeze_no_preference_buckets, null: false, default: false

      t.timestamps
    end

    create_table :registration_policy_buckets do |t|
      t.references :registration_policy, null: false
      t.integer :position, null: false
      t.string :key, null: false
      t.text :name, null: false
      t.text :description
      t.integer :minimum_slots, null: false, default: 0
      t.integer :preferred_slots, null: false, default: 0
      t.integer :total_slots, null: false, default: 0
      t.boolean :slots_limited, default: false, null: false
      t.boolean :flex, default: false, null: false
      t.boolean :counted, default: true, null: false
      t.boolean :expose_attendees, default: false, null: false

      t.timestamps

      t.index %i[registration_policy_id key], unique: true
      t.index %i[registration_policy_id position], unique: true
    end

    add_reference :events, :registration_policy, foreign_key: true
    add_reference :event_proposals, :registration_policy, foreign_key: true

    reversible do |dir|
      dir.up do
        migrate_registration_policies_for("events")
        migrate_registration_policies_for("event_proposals", skip_if_null: true)
      end
    end

    change_table :events, bulk: true do |t|
      t.remove :registration_policy, type: :jsonb
      t.change_null :registration_policy_id, false
    end

    change_table :event_proposals, bulk: true do |t|
      t.remove :registration_policy, type: :jsonb
    end

    reversible { |dir| dir.up { drop_registration_policy_functions } }
  end

  private

  def migrate_registration_policies_for(table_name, skip_if_null: false)
    data = select_rows("SELECT id, registration_policy FROM #{table_name}")
    data.each do |(record_id, policy_json)|
      next if skip_if_null && policy_json.nil?

      policy = JSON.parse(policy_json || "{}")

      registration_policy_id = insert_registration_policy(policy)
      insert_registration_policy_buckets(registration_policy_id, policy["buckets"] || [])

      exec_update(
        "UPDATE #{table_name} SET registration_policy_id = $1 WHERE id = $2",
        "#{table_name} update",
        [registration_policy_id, record_id]
      )
    end
  end

  def insert_registration_policy(policy)
    now = Time.zone.now
    exec_insert(
      <<~SQL.squish,
        INSERT INTO registration_policies
        (prevent_no_preference_signups, freeze_no_preference_buckets, created_at, updated_at)
        VALUES ($1, $2, $3, $4)
      SQL
      "RegistrationPolicy insert",
      [!!policy["prevent_no_preference_signups"], !!policy["freeze_no_preference_buckets"], now, now],
      returning: [:id]
    ).rows.first.first
  end

  def insert_registration_policy_buckets(registration_policy_id, buckets)
    now = Time.zone.now
    bucket_values =
      buckets.each_with_index.map do |bucket, index|
        {
          registration_policy_id:,
          position: index + 1,
          key: bucket["key"],
          name: bucket["name"] || bucket["key"],
          description: bucket["description"],
          minimum_slots: bucket["minimum_slots"] || 0,
          preferred_slots: bucket["preferred_slots"] || 0,
          total_slots: bucket["total_slots"] || 0,
          slots_limited: !!bucket["slots_limited"],
          flex: !!bucket["anything"],
          counted: !bucket["not_counted"], # we're inverting the meaning on this one
          expose_attendees: !!bucket["expose_attendees"],
          created_at: now,
          updated_at: now
        }
      end

    exec_insert(<<~SQL.squish, "RegistrationPolicyBucket bulk insert", [bucket_values.to_json])
        INSERT INTO registration_policy_buckets
        (
          registration_policy_id, position, key, name, description, minimum_slots, preferred_slots,
          total_slots, slots_limited, flex, counted, expose_attendees, created_at, updated_at
        )
        SELECT
          registration_policy_id, position, key, name, description, minimum_slots, preferred_slots,
          total_slots, slots_limited, flex, counted, expose_attendees, created_at, updated_at
        FROM jsonb_populate_recordset(NULL::registration_policy_buckets, $1::jsonb)
      SQL
  end

  def drop_registration_policy_functions
    SLOT_COUNT_TYPES.each do |slot_count_type|
      execute "DROP FUNCTION IF EXISTS bucket_#{slot_count_type}_slots(registration_policy jsonb, bucket_key text)"
      SLOT_COUNTED_TYPES.each do |counted_type|
        execute "DROP FUNCTION IF EXISTS #{slot_count_type}_#{counted_type}_slots(registration_policy jsonb)"
      end
    end
    execute "DROP FUNCTION IF EXISTS registration_bucket(registration_policy jsonb, bucket_key text)"
    execute "DROP FUNCTION IF EXISTS anything_bucket_keys(registration_policy jsonb)"
    execute "DROP FUNCTION IF EXISTS not_counted_bucket_keys(registration_policy jsonb)"
    execute "DROP FUNCTION IF EXISTS counted_bucket_keys(registration_policy jsonb)"
    execute "DROP FUNCTION IF EXISTS bucket_keys(registration_policy jsonb)"
    execute "DROP FUNCTION IF EXISTS registration_policy_buckets(registration_policy jsonb)"
  end
end
# rubocop:enable Metrics/ClassLength
