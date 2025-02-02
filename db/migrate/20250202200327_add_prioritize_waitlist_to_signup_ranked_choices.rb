class AddPrioritizeWaitlistToSignupRankedChoices < ActiveRecord::Migration[8.0]
  def change
    add_column :signup_ranked_choices, :prioritize_waitlist, :boolean, default: false, null: false
  end
end
