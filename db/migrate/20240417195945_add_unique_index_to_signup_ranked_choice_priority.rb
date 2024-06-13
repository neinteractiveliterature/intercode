class AddUniqueIndexToSignupRankedChoicePriority < ActiveRecord::Migration[7.1]
  def change
    add_index :signup_ranked_choices, %i[user_con_profile_id state priority], unique: true
  end
end
