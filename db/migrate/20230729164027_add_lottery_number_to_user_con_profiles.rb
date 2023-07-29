class AddLotteryNumberToUserConProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :user_con_profiles, :lottery_number, :integer

    reversible do |dir|
      dir.up do
        Convention.find_each do |convention|
          say "Generating lottery numbers for #{convention.name}"

          execute <<~SQL
          with lottery_numbers as (
            select num, row_number() over (order by random()) lottery_number_ord
            from generate_series(1, 10000) num
            order by random()
          ), user_con_profile_data as (
            select id, row_number() over (order by id) user_con_profile_ord
            from user_con_profiles
            where convention_id = #{convention.id}
          )
          update user_con_profiles
          set lottery_number = lottery_numbers.num
          from lottery_numbers, user_con_profile_data
          where user_con_profile_data.id = user_con_profiles.id and lottery_number_ord = user_con_profile_ord
          SQL
        end
      end
    end

    change_column_null :user_con_profiles, :lottery_number, false
    add_index :user_con_profiles, %i[convention_id lottery_number], unique: true
  end
end
