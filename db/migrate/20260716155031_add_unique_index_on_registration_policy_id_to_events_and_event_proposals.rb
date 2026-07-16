# frozen_string_literal: true
class AddUniqueIndexOnRegistrationPolicyIdToEventsAndEventProposals < ActiveRecord::Migration[8.1]
  def change
    remove_index :events, :registration_policy_id
    add_index :events, :registration_policy_id, unique: true

    remove_index :event_proposals, :registration_policy_id
    add_index :event_proposals, :registration_policy_id, unique: true
  end
end
