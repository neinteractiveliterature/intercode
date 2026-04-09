class MakeLotteryNumberIndexDeferrable < ActiveRecord::Migration[8.1]
  def up
    remove_index :user_con_profiles, %i[convention_id lottery_number], unique: true
    execute <<~SQL
      ALTER TABLE user_con_profiles
        ADD CONSTRAINT index_user_con_profiles_on_convention_id_and_lottery_number
        UNIQUE (convention_id, lottery_number)
        DEFERRABLE INITIALLY DEFERRED;
    SQL
  end

  def down
    execute <<~SQL
      ALTER TABLE user_con_profiles
        DROP CONSTRAINT index_user_con_profiles_on_convention_id_and_lottery_number;
    SQL
    add_index :user_con_profiles, %i[convention_id lottery_number], unique: true
  end
end
