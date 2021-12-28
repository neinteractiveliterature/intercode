# frozen_string_literal: true
class OrderPolicy < ApplicationPolicy
  delegate :user_con_profile, to: :record
  delegate :convention, to: :user_con_profile

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction do |d|
         d.add(:read_conventions) do
           has_convention_permission?(convention, 'read_orders') ||
             (
               record.tickets.any? &&
                 record.tickets.any? { |ticket| TicketPolicy.new(authorization_info, ticket).read? }
             )
         end
         d.add(:read_profile) { user && user.id == user_con_profile.user_id }
       end
      return true
    end

    super
  end

  def manage?
    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_orders') }
       end
      return true
    end

    super
  end

  def manage_coupons?
    manage? || submit?
  end

  def submit?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction do |d|
         d.add(:manage_profile) do
           %w[pending unpaid].include?(record.status) && user && user.id == user_con_profile.user_id
         end
       end
      return true
    end

    manage?
  end

  def cancel?
    manage?
  end

  class Scope < Scope
    def resolve
      return scope if site_admin?

      order_scope =
        disjunctive_where do |dw|
          if oauth_scope?(:read_conventions)
            dw.add(
              user_con_profile_id:
                UserConProfile.where(convention: conventions_with_permission('read_orders', 'update_orders'))
            )
          end

          dw.add(user_con_profile_id: UserConProfile.where(user_id: user.id)) if user && oauth_scope?(:read_profile)
        end

      if assumed_identity_from_profile
        order_scope.where(
          user_con_profile_id: UserConProfile.where(convention_id: assumed_identity_from_profile.convention.id)
        )
      else
        order_scope
      end
    end
  end
end
