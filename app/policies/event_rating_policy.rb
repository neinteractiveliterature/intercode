# frozen_string_literal: true
class EventRatingPolicy < ApplicationPolicy
  def read?
    return false unless user
    return false unless oauth_scope?(:read_signups)
    record.user_con_profile.user_id == actual_user.id
  end

  def manage?
    return false unless user
    return false unless oauth_scope?(:manage_signups)
    record.user_con_profile.user_id == actual_user.id
  end

  class Scope < Scope
    def resolve
      return scope.none unless user
      return scope.none unless oauth_scope?(:read_signups)
      scope.joins(:user_con_profile).where(user_con_profiles: { user_id: actual_user.id })
    end
  end
end
