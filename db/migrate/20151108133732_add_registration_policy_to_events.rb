class AddRegistrationPolicyToEvents < ActiveRecord::Migration[4.2]
  def change
    add_column :events, :registration_policy, :text
  end
end
