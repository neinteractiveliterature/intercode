class EventProposal < ApplicationRecord
  STATUSES = Set.new(%w(draft proposed reviewing accepted rejected dropped))

  belongs_to :convention
  belongs_to :owner, class_name: 'UserConProfile'
  belongs_to :event, optional: true

  serialize :additional_info, JSON

  validates :status, inclusion: { in: STATUSES }
end
