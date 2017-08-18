class EventProposal < ApplicationRecord
  include Concerns::FormResponse

  STATUSES = Set.new(%w(draft proposed reviewing accepted rejected dropped))

  register_form_response_attrs :title,
    :email,
    :length_seconds,
    :description,
    :short_blurb,
    :registration_policy,
    :can_play_concurrently

  belongs_to :convention
  belongs_to :owner, class_name: 'UserConProfile'
  belongs_to :event, optional: true

  STATUSES.each do |status|
    scope status, -> { where(status: status) }
  end

  serialize :registration_policy, ActiveModelCoder.new('RegistrationPolicy')

  validates :status, inclusion: { in: STATUSES }
end
