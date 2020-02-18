class CreateSignupChanges < ActiveRecord::Migration[6.0]
  def change
    create_table :signup_changes do |t|
      t.references :signup, null: false, foreign_key: true
      t.references :run, null: false, foreign_key: true
      t.references :user_con_profile, null: false, foreign_key: true
      t.references :previous_signup_change, null: true, foreign_key: { to_table: :signup_changes }
      t.references :updated_by, null: true, foreign_key: { to_table: :users }
      t.string :bucket_key
      t.string :requested_bucket_key
      t.string :state, null: false
      t.boolean :counted, null: true
      t.string :action, null: false

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        execute <<~SQL
        INSERT INTO signup_changes
          (signup_id, run_id, user_con_profile_id, updated_by_id,
            bucket_key, requested_bucket_key, state, counted, action,
            created_at, updated_at)
        SELECT
          id, run_id, user_con_profile_id, updated_by_id,
          bucket_key, requested_bucket_key, state, counted, 'unknown',
          updated_at, updated_at
        FROM signups
        SQL
      end
    end
  end
end
