# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ticket_types
#
#  id                                :integer          not null, primary key
#  allows_event_signups              :boolean          default(TRUE), not null
#  counts_towards_convention_maximum :boolean          default(TRUE), not null
#  description                       :text
#  maximum_event_provided_tickets    :integer          default(0), not null
#  name                              :text             not null
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  convention_id                     :integer
#
# Indexes
#
#  index_ticket_types_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class TicketType < ApplicationRecord
  belongs_to :convention

  has_many :tickets
  has_many :maximum_event_provided_tickets_overrides
  has_many :providing_products, class_name: 'Product', foreign_key: 'provides_ticket_type_id', dependent: :nullify

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
