class AddRankedChoiceOrderingBoostToUserConProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :user_con_profiles, :ranked_choice_ordering_boost, :integer
  end
end
