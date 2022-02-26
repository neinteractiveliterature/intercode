# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: tickets
#
#  id                   :integer          not null, primary key
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  event_id             :bigint
#  order_entry_id       :bigint
#  provided_by_event_id :integer
#  ticket_type_id       :integer
#  user_con_profile_id  :integer
#
# Indexes
#
#  index_tickets_on_event_id              (event_id)
#  index_tickets_on_order_entry_id        (order_entry_id)
#  index_tickets_on_provided_by_event_id  (provided_by_event_id)
#  index_tickets_on_ticket_type_id        (ticket_type_id)
#  index_tickets_on_user_con_profile_id   (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (order_entry_id => order_entries.id)
#  fk_rails_...  (provided_by_event_id => events.id)
#  fk_rails_...  (ticket_type_id => ticket_types.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Ticket < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :ticket_type
  belongs_to :provided_by_event, class_name: 'Event', optional: true, inverse_of: 'provided_tickets'
  belongs_to :order_entry, optional: true
  belongs_to :event, optional: true

  validates :user_con_profile, :ticket_type, presence: true
  validates :user_con_profile, uniqueness: true
  validate :ticket_type_must_be_valid_for_convention
  validate :provided_by_event_must_be_part_of_convention, on: :create

  delegate :convention, to: :user_con_profile
  delegate :user, to: :user_con_profile
  delegate :allows_event_signups?, :allows_event_signups, to: :ticket_type

  scope :counts_towards_convention_maximum,
        -> { joins(:ticket_type).where(ticket_types: { counts_towards_convention_maximum: true }) }

  after_commit :send_user_activity_alerts, on: :create

  def to_liquid
    TicketDrop.new(self)
  end

  private

  def ticket_type_must_be_valid_for_convention
    return unless ticket_type
    return if convention.ticket_types.include?(ticket_type)

    errors.add(:ticket_type, "is not a valid #{convention.ticket_name} type for #{convention.name}")
  end

  def provided_by_event_must_be_part_of_convention
    return unless provided_by_event
    return if convention.events.include?(provided_by_event)

    errors.add(:provided_by_event, "is not part of #{convention}")
  end

  def send_user_activity_alerts
    SendUserActivityAlertsJob.perform_later(user_con_profile, 'ticket_create')
  end
end
