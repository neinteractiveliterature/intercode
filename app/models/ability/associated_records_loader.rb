class Ability::AssociatedRecordsLoader
  attr_reader :user_ids

  def initialize(user_ids)
    @user_ids = user_ids
  end

  def team_member_event_ids(user_id)
    (team_member_event_ids_and_convention_ids[user_id] || []).map(&:first)
  end

  def team_member_convention_ids(user_id)
    (team_member_event_ids_and_convention_ids[user_id] || []).map(&:second)
  end

  def team_member_signed_up_user_con_profile_ids(user_id)
    team_member_signed_up_user_con_profile_ids_by_user_id[user_id] || []
  end

  def con_ids_with_privilege(user_id, *privileges)
    (privileges + ['staff']).uniq.flat_map do |privilege|
      user_con_ids_by_privilege = con_ids_by_user_id_and_privilege[user_id] || {}
      user_con_ids_by_privilege[privilege.to_s] || []
    end.uniq
  end

  def staff_con_ids(user_id)
    con_ids_with_privilege(user_id, :staff)
  end

  def signed_up_run_ids(user_id)
    signed_up_run_ids_by_user_id[user_id] || []
  end

  def own_event_proposal_ids(user_id)
    own_event_proposal_ids_by_user_id[user_id] || []
  end

  private

  def con_ids_by_user_id_and_privilege
    @con_ids_by_user_id_and_privilege ||= begin
      user_con_profiles = UserConProfile.where(user_id: user_ids).includes(:user)
      con_ids_with_privileges = user_con_profiles.flat_map do |user_con_profile|
        user_con_profile.privileges.map do |privilege|
          [user_con_profile.user_id, user_con_profile.convention_id, privilege]
        end
      end

      privilege_tuples_by_user_id = con_ids_with_privileges.group_by { |(user_id, _, _)| user_id }
      privilege_tuples_by_user_id.transform_values do |privilege_tuples|
        privilege_tuples
          .group_by { |(_, _, privilege)| privilege }
          .transform_values { |rows| rows.map { |(_, convention_id, _)| convention_id } }
      end
    end
  end

  def team_member_event_ids_and_convention_ids
    @team_member_event_ids_and_convention_ids ||= begin
      team_member_events = Event.joins(team_members: :user_con_profile)
        .where(user_con_profiles: { user_id: user_ids })
      team_member_event_data = team_member_events.pluck(:user_id, :id, :convention_id)
      team_member_event_data.group_by(&:first).transform_values do |rows|
        rows.map do |(_, id, convention_id)|
          [id, convention_id]
        end
      end
    end
  end

  def team_member_signed_up_user_con_profile_ids_by_user_id
    @team_member_signed_up_user_con_profile_ids ||= begin
      team_member_run_ids_by_event_id = Run
        .where(event_id: team_member_event_ids_and_convention_ids.values.flat_map { |pairs| pairs.map(&:first) })
        .pluck(:event_id, :id)
        .group_by(&:first)
        .transform_values { |pairs| pairs.map(&:second) }

      team_member_run_ids_by_user_id = team_member_event_ids_and_convention_ids.each_with_object({}) do |(user_id, pairs), hash|
        event_ids = pairs.map(&:first)
        run_ids = event_ids.flat_map { |event_id| team_member_run_ids_by_event_id[event_id] }
        hash[user_id] = run_ids
      end

      signed_up_user_con_profile_ids_by_run_id = Signup.where(run_id: team_member_run_ids_by_user_id.values.flatten)
        .pluck(:run_id, :user_con_profile_id)
        .group_by(&:first)
        .transform_values { |pairs| pairs.map(&:second) }

      team_member_run_ids_by_user_id.transform_values do |run_ids|
        run_ids.flat_map { |run_id| signed_up_user_con_profile_ids_by_run_id[run_id] }
      end
    end
  end

  def signed_up_run_ids_by_user_id
    @signed_up_run_ids_by_user_id ||= Signup.joins(:user_con_profile)
      .where(user_con_profiles: { user_id: user_ids }, state: %w[confirmed waitlisted])
      .pluck(:run_id, :user_id)
      .group_by { |(_, user_id)| user_id }
      .transform_values do |rows|
        rows.map { |(run_id, _)| run_id }
      end
  end

  def own_event_proposal_ids_by_user_id
    @own_event_proposal_ids_by_user_id ||= begin
      own_event_proposals = EventProposal.joins(:owner)
        .where(user_con_profiles: { user_id: user_ids })
      own_event_proposals.pluck(:id, :user_id)
        .group_by { |(_, user_id)| user_id }
        .transform_values do |rows|
          rows.map { |(event_proposal_id, _)| event_proposal_id }
        end
    end
  end
end
