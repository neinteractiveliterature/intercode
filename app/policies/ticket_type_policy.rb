# frozen_string_literal: true
class TicketTypePolicy < ApplicationPolicy
  delegate :convention, to: :record
  delegate :event, to: :record

  def read?
    true
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_events) { event && team_member_for_event?(event) }
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_ticket_types') }
       end
      return true
    end

    super
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
