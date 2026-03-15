class AddRerandomizeLotteryNumbersToSignupRounds < ActiveRecord::Migration[8.1]
  def change
    add_column :signup_rounds, :rerandomize_lottery_numbers, :boolean, default: false, null: false
  end
end
