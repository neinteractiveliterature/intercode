class EventRatingPolicy < ApplicationPolicy
  def read?
    manage?
  end

  def manage?
    return false unless user
    return false if doorkeeper_token # cookie auth only

    record.user_con_profile.user_id == actual_user.id
  end

  class Scope < Scope
    def resolve
      return scope.none unless user
      return scope.none if doorkeeper_token # cookie auth only

      scope.joins(:user_con_profile).where(user_con_profiles: { user_id: actual_user.id })
    end
  end
end
