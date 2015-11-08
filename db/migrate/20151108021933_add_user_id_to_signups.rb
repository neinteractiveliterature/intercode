class AddUserIdToSignups < ActiveRecord::Migration
  def change
    add_reference :signups, :user, index: true, foreign_key: true
  end
end
