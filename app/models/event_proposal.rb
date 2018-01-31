class EventProposal < ApplicationRecord
  include Concerns::FormResponse

  STATUSES = Set.new(%w(draft proposed reviewing accepted rejected withdrawn))

  register_form_response_attrs :title,
    :email,
    :length_seconds,
    :description,
    :short_blurb,
    :registration_policy,
    :can_play_concurrently,
    :timeblock_preferences

  belongs_to :convention
  belongs_to :owner, class_name: 'UserConProfile', optional: true
  belongs_to :event, optional: true

  STATUSES.each do |status|
    scope status, -> { where(status: status) }
  end

  serialize :registration_policy, ActiveModelCoder.new('RegistrationPolicy')
  serialize :timeblock_preferences, JsonArrayCoderWrapper.new(ActiveModelCoder.new('EventProposal::TimeblockPreference'))

  validates :status, inclusion: { in: STATUSES }
  validate :length_fits_in_convention

  def to_liquid
    EventProposalDrop.new(self)
  end

  private

  def length_fits_in_convention
    return unless length_seconds
    if length_seconds > convention.length_seconds
      errors.add :length_seconds, "Event cannot be longer than #{convention.name}"
    end
  end
end
