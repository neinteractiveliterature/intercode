class UserConProfilePolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    # you can read the less-sensitive parts of your own profile without read_profile scope
    return true if user && user.id == record.user_id
    if record.team_members.any? && TeamMemberPolicy.new(user, record.team_members.first).read?
      return true
    end

    read_email?
  end

  def read_email?
    return true if read_personal_info?

    oauth_scoped_disjunction do |d|
      d.add(:read_conventions) { team_member_in_convention?(convention) }
    end
  end

  def read_personal_info?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_profile) { profile_is_user_or_identity_assumer? }
      d.add(:read_conventions) do
        has_privilege_in_convention?(convention, :con_com) ||
        has_event_category_permission_in_convention?(convention, 'read_event_proposals') ||
        team_member_for_user_con_profile?(record)
      end
    end

    site_admin_read?
  end

  def create?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_profile) { user && user.id == record.user_id }
    end

    manage?
  end

  def update?
    create?
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { staff_in_convention?(convention) }
    end

    super
  end

  def become?
    manage?
  end

  def withdraw_all_signups?
    manage?
  end

  def update_privileges?
    manage?
  end

  private

  def profile_is_user_or_identity_assumer?
    return true if user && user.id == record.user_id

    assumed_identity_from_profile && assumed_identity_from_profile.user_id == record.user_id
  end

  class Scope < Scope
    def resolve
      # TODO finish this scope!  We don't actually use it in the code yet but sooner or later
      # I'm going to accidentally use it and then I'll be sorry
      scope.all
    end
  end
end
