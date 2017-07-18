class AddRegistrationPolicyToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :registration_policy, :text
  end
end
