# frozen_string_literal: true
class UserConProfilePolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    # you can read the less-sensitive parts of your own profile without read_profile scope
    return true if profile_is_user_or_identity_assumer?

    # you can always read bio-eligible profiles
    return true if record.can_have_bio?

    if oauth_scoped_disjunction do |d|
         d.add(:read_events) { user_con_profile_ids_in_signed_up_runs.include?(record.id) }
       end
      return true
    end

    if oauth_scoped_disjunction do |d|
         d.add(:read_conventions) { has_convention_permission?(convention, 'read_user_con_profiles') }
       end
      return true
    end

    read_email?
  end

  def read_email?
    return true if read_personal_info?

    oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        team_member_in_convention?(convention) || has_convention_permission?(convention, 'read_user_con_profile_email')
      end
    end
  end

  def read_birth_date?
    if oauth_scoped_disjunction do |d|
         d.add(:read_profile) { profile_is_user_or_identity_assumer? }
         d.add(:read_conventions) { has_convention_permission?(convention, 'read_user_con_profile_birth_date') }
       end
      return true
    end

    site_admin_read?
  end

  def read_personal_info?
    if oauth_scoped_disjunction do |d|
         d.add(:read_profile) { profile_is_user_or_identity_assumer? }
         d.add(:read_conventions) do
           has_convention_permission?(convention, 'read_user_con_profile_personal_info') ||
             has_event_category_permission_in_convention?(convention, 'read_event_proposals') ||
             team_member_for_user_con_profile?(record)
         end
       end
      return true
    end

    site_admin_read?
  end

  def create?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention
    return true if oauth_scoped_disjunction { |d| d.add(:manage_profile) { user && user.id == record.user_id } }

    manage?
  end

  def update?
    create?
  end

  def manage?
    return false if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    if oauth_scoped_disjunction do |d|
         d.add(:manage_conventions) { has_convention_permission?(convention, 'update_user_con_profiles') }
       end
      return true
    end

    super
  end

  def become?
    manage?
  end

  def withdraw_all_signups?
    manage?
  end

  def form_item_viewer_role
    return :normal if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    FormItem.highest_level_role(
      all_profiles_basic_access: has_convention_permission?(convention, 'read_user_con_profiles'),
      # admin for user con profiles acts like "has the highest level permissions on this profile"
      admin:
        (
          has_convention_permission?(convention, 'read_user_con_profiles') &&
            has_convention_permission?(convention, 'read_user_con_profile_birth_date') &&
            has_convention_permission?(convention, 'read_user_con_profile_personal_info') &&
            has_convention_permission?(convention, 'read_user_con_profile_email')
        )
    )
  end

  def form_item_writer_role
    return :normal if assumed_identity_from_profile && assumed_identity_from_profile.convention != convention

    FormItem.highest_level_role(
      all_profiles_basic_access: has_convention_permission?(convention, 'update_user_con_profiles'),
      # admin for user con profiles acts like "has the highest level permissions on this profile"
      admin:
        (
          has_convention_permission?(convention, 'update_user_con_profiles') &&
            has_convention_permission?(convention, 'read_user_con_profile_birth_date') &&
            has_convention_permission?(convention, 'read_user_con_profile_personal_info') &&
            has_convention_permission?(convention, 'read_user_con_profile_email')
        )
    )
  end

  private

  def profile_is_user_or_identity_assumer?
    return true if actual_user && actual_user.id == record.user_id

    assumed_identity_from_profile && assumed_identity_from_profile.convention_id == record.convention_id
  end

  class Scope < Scope
    # rubocop:disable Metrics/MethodLength
    def resolve
      return scope.all if site_admin? && oauth_scope?(:read_conventions)

      user_con_profile_scope =
        disjunctive_where do |dw|
          dw.add(user_id: user.id) if user
          dw.add(id: TeamMemberPolicy::Scope.new(user, TeamMember.all).resolve.select(:user_con_profile_id))
          dw.add(convention: conventions_where_team_member)
          dw.add(
            convention:
              conventions_with_permission(
                'read_user_con_profiles',
                'read_user_con_profile_email',
                'read_user_con_profile_personal_info'
              )
          )
          dw.add(convention: event_categories_with_permission('read_event_proposals').select(:convention_id))
        end

      if assumed_identity_from_profile
        user_con_profile_scope.where(convention_id: assumed_identity_from_profile.convention_id)
      else
        user_con_profile_scope
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end
