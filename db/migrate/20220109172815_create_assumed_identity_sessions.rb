class CreateAssumedIdentitySessions < ActiveRecord::Migration[7.0]
  def change
    create_table :assumed_identity_sessions do |t|
      t.references :assumed_profile, null: false, foreign_key: { to_table: :user_con_profiles }
      t.references :assumer_profile, null: false, foreign_key: { to_table: :user_con_profiles }
      t.text :justification, null: false
      t.timestamp :started_at, null: false
      t.timestamp :finished_at

      t.timestamps
    end
  end
end
