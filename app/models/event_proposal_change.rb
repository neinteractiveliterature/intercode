class EventProposalChange < ApplicationRecord
  belongs_to :event_proposal
  belongs_to :user_con_profile

  serialize :previous_value, JSON
  serialize :new_value, JSON
end
