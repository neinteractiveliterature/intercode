class CreateSignupRankedChoices < ActiveRecord::Migration[7.1]
  def change
    create_table :signup_ranked_choices do |t|
      t.integer :priority, null: false
      t.string :requested_bucket_key, null: false
      t.string :state, null: false
      t.references :result_signup, null: true, foreign_key: { to_table: "signups" }
      t.references :target_run, null: false, foreign_key: { to_table: "runs" }
      t.references :updated_by, null: false, foreign_key: { to_table: "users" }
      t.references :user_con_profile, null: false, foreign_key: true

      t.timestamps
    end
  end
end
