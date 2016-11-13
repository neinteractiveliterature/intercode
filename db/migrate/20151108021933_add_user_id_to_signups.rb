class AddUserIdToSignups < ActiveRecord::Migration[4.2]
  def change
    add_reference :signups, :user, index: true, foreign_key: true
  end
end
