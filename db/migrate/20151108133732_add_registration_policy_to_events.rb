class AddRegistrationPolicyToEvents < ActiveRecord::Migration
  def change
    add_column :events, :registration_policy, :text
  end
end
