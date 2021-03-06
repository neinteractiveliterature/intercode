class UserConProfilePolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    # you can read the less-sensitive parts of your own profile without read_profile scope
    return true if user && user.id == record.user_id

    # you can always read bio-eligible profiles
    return true if record.can_have_bio?

    return true if oauth_scoped_disjunction do |d|
      d.add(:read_events) { user_con_profile_ids_in_signed_up_runs.include?(record.id) }
    end

    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) { has_convention_permission?(convention, 'read_user_con_profiles') }
    end

    read_email?
  end

  def read_email?
    return true if read_personal_info?

    oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        team_member_in_convention?(convention) ||
          has_convention_permission?(convention, 'read_user_con_profile_email')
      end
    end
  end

  def read_birth_date?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_profile) { profile_is_user_or_identity_assumer? }
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'read_user_con_profile_birth_date')
      end
    end

    site_admin_read?
  end

  def read_personal_info?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_profile) { profile_is_user_or_identity_assumer? }
      d.add(:read_conventions) do
        has_convention_permission?(convention, 'read_user_con_profile_personal_info') ||
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
      d.add(:manage_conventions) do
        has_convention_permission?(convention, 'update_user_con_profiles')
      end
    end

    super
  end

  def become?
    manage?
  end

  def withdraw_all_signups?
    manage?
  end

  private

  def profile_is_user_or_identity_assumer?
    return true if user && user.id == record.user_id

    assumed_identity_from_profile && assumed_identity_from_profile.user_id == record.user_id
  end

  class Scope < Scope
    def resolve
      return scope.all if site_admin? && oauth_scope?(:read_conventions)

      disjunctive_where do |dw|
        dw.add(user_id: user.id) if user
        dw.add(id: TeamMemberPolicy::Scope.new(user, TeamMember.all).resolve
          .select(:user_con_profile_id))
        dw.add(convention: conventions_where_team_member)
        dw.add(convention: conventions_with_permission(
          'read_user_con_profiles',
          'read_user_con_profile_email',
          'read_user_con_profile_personal_info'
        ))
        dw.add(convention: event_categories_with_permission('read_event_proposals')
          .select(:convention_id))
      end
    end
  end
end
