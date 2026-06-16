class ConvertRegistrationPoliciesToTables < ActiveRecord::Migration[8.1]
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
      t.integer :minimum_slots
      t.integer :preferred_slots
      t.integer :total_slots
      t.boolean :slots_limited, default: false, null: false
      t.boolean :flex, default: false, null: false
      t.boolean :counted, default: true, null: false
      t.boolean :expose_attendees, default: false, null: false

      t.timestamps

      t.index [:registration_policy_id, :key], unique: true
    end

    add_reference :events, :registration_policy, foreign_key: true

    reversible do |dir|
      dir.up do
        data = select_rows("SELECT id, registration_policy FROM events")
        data.each do |(event_id, policy_json)|
          policy = JSON.parse(policy_json || "{}")
          now = Time.zone.now

          registration_policy_id = exec_insert(
            "INSERT INTO registration_policies (prevent_no_preference_signups, freeze_no_preference_buckets, created_at, updated_at) VALUES ($1, $2, $3, $4)",
            "RegistrationPolicy insert",
            [
              !!policy["prevent_no_preference_signups"],
              !!policy["freeze_no_preference_buckets"],
              now,
              now
            ],
            returning: [:id]
          ).rows.first.first

          now = Time.zone.now
          bucket_values = (policy["buckets"] || []).each_with_index.map do |bucket, index|
            {
              registration_policy_id:,
              position: index + 1,
              key: bucket["key"],
              name: bucket["name"] || bucket["key"],
              description: bucket["description"],
              minimum_slots: bucket["minimum_slots"],
              preferred_slots: bucket["preferred_slots"],
              total_slots: bucket["total_slots"],
              slots_limited: !!bucket["slots_limited"],
              flex: !!bucket["anything"],
              counted: !bucket["not_counted"], # we're inverting the meaning on this one
              expose_attendees: !!bucket["expose_attendees"],
              created_at: now,
              updated_at: now
            }
          end

          exec_insert(
            <<~SQL.squish,
              INSERT INTO registration_policy_buckets
              (
                registration_policy_id,
                position,
                key,
                name,
                description,
                minimum_slots,
                preferred_slots,
                total_slots,
                slots_limited,
                flex,
                counted,
                expose_attendees,
                created_at,
                updated_at
              )
              SELECT
                registration_policy_id,
                position,
                key,
                name,
                description,
                minimum_slots,
                preferred_slots,
                total_slots,
                slots_limited,
                flex,
                counted,
                expose_attendees,
                created_at,
                updated_at
              FROM jsonb_populate_recordset(NULL::registration_policy_buckets, $1::jsonb)
            SQL
            "RegistrationPolicyBucket bulk insert",
            [bucket_values.to_json]
          )

          exec_update(
            "UPDATE events SET registration_policy_id = $1 WHERE id = $2",
            "Event update",
            [registration_policy_id, event_id]
          )
        end
      end
    end

    change_table :events, bulk: true do |t|
      t.remove :registration_policy, type: :jsonb
      t.change_null :registration_policy_id, false
    end
  end
end
