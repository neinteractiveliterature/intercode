class AddRankedChoiceAllowWaitlistToUserConProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :user_con_profiles, :ranked_choice_allow_waitlist, :boolean, null: false, default: true
  end
end
