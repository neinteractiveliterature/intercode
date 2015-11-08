class AddRegistrationPolicyToEvents < ActiveRecord::Migration
  def change
    add_column :events, :registration_policy, :jsonb, index: true
  end
end
