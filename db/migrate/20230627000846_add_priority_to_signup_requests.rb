class AddPriorityToSignupRequests < ActiveRecord::Migration[7.0]
  def change
    add_column :signup_requests, :priority, :integer
  end
end
