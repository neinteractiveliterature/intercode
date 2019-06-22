class CreateSignupRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :signup_requests do |t|
      t.string :state, null: false, default: 'pending', index: true
      t.references :user_con_profile, null: false, foreign_key: true
      t.references :target_run, null: false, foreign_key: { to_table: :runs }
      t.string :requested_bucket_key, null: false
      t.references :replace_signup, foreign_key: { to_table: :signups }
      t.references :result_signup, foreign_key: { to_table: :signups }
      t.references :updated_by, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
