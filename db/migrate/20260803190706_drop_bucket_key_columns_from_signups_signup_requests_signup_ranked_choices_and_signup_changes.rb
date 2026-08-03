# frozen_string_literal: true
class DropBucketKeyColumnsFromSignupsSignupRequestsSignupRankedChoicesAndSignupChanges < ActiveRecord::Migration[8.1]
  def change
    reversible do |dir|
      dir.up do
        remove_check_constraint :signups, name: "bucket_key_null_for_non_slot_occupying_states"
        add_check_constraint :signups,
                             "(bucket_id IS NULL) OR ((state)::text = ANY (ARRAY['confirmed'::text, 'ticket_purchase_hold'::text]))", # rubocop:disable Layout/LineLength
                             name: "bucket_id_null_for_non_slot_occupying_states"
      end

      dir.down do
        remove_check_constraint :signups, name: "bucket_id_null_for_non_slot_occupying_states"
        add_check_constraint :signups,
                             "(bucket_key IS NULL) OR ((state)::text = ANY (ARRAY['confirmed'::text, 'ticket_purchase_hold'::text]))", # rubocop:disable Layout/LineLength
                             name: "bucket_key_null_for_non_slot_occupying_states"
      end
    end

    change_table :signups, bulk: true do |t|
      t.remove :bucket_key, type: :string
      t.remove :requested_bucket_key, type: :string
    end

    remove_column :signup_requests, :requested_bucket_key, :string

    remove_column :signup_ranked_choices, :requested_bucket_key, :string

    change_table :signup_changes, bulk: true do |t|
      t.remove :bucket_key, type: :string
      t.remove :requested_bucket_key, type: :string
    end
  end
end
