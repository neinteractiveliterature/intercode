class AddWaitlistPositionCapToSignupRankedChoices < ActiveRecord::Migration[8.1]
  def change
    add_column :signup_ranked_choices, :waitlist_position_cap, :integer
  end
end
