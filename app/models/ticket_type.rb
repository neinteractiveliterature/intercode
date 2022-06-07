# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ticket_types
#
#  id                                :bigint           not null, primary key
#  allows_event_signups              :boolean          default(TRUE), not null
#  counts_towards_convention_maximum :boolean          default(TRUE), not null
#  description                       :text
#  maximum_event_provided_tickets    :integer          default(0), not null
#  name                              :text             not null
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  convention_id                     :bigint
#  event_id                          :bigint
#
# Indexes
#
#  index_ticket_types_on_convention_id  (convention_id)
#  index_ticket_types_on_event_id       (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_id => events.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class TicketType < ApplicationRecord
  include ExclusiveArc

  belongs_to :convention, optional: true
  belongs_to :event, optional: true

  has_many :tickets
  has_many :maximum_event_provided_tickets_overrides
  has_many :providing_products, class_name: 'Product', foreign_key: 'provides_ticket_type_id', dependent: :nullify

  exclusive_arc :parent, [Convention, Event]

  # Only allow letters, numbers, and underscores
  validates :name, format: { with: /\A\w+\z/, allow_blank: false }

  scope :event_provided, -> { where('maximum_event_provided_tickets > 0') }

  def maximum_event_provided_tickets_for_event_id(event_id)
    (
      maximum_event_provided_tickets_overrides.find_by(event_id: event_id)&.override_value ||
        maximum_event_provided_tickets
    )
  end

  def event_provided?
    maximum_event_provided_tickets.positive?
  end

  def to_liquid
    TicketTypeDrop.new(self)
  end
end
