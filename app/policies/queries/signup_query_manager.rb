class Queries::SignupQueryManager < Queries::QueryManager
  def initialize(user:)
    super(user: user)
    @signed_up_for_run = Queries::NilSafeCache.new
    @signed_up_for_event = Queries::NilSafeCache.new
  end

  def signed_up_for_run?(run)
    return false unless run && user

    @signed_up_for_run.get(run.id) do
      Signup.joins(:user_con_profile)
        .where(user_con_profiles: { user_id: user.id }, run_id: run.id)
        .where.not(state: 'withdrawn')
        .any?
    end
  end

  def signed_up_for_event?(event)
    return false unless event && user

    @signed_up_for_event.get(event.id) do
      Signup.joins(:user_con_profile, :run)
        .where(user_con_profiles: { user_id: user.id }, runs: { event_id: event.id })
        .where.not(state: 'withdrawn')
        .any?
    end
  end

  def my_active_signups
    return Signup.none unless user

    Signup.joins(:user_con_profile)
      .where(user_con_profiles: { user_id: user.id })
      .where.not(state: 'withdrawn')
  end

  def runs_where_signed_up
    Run.where(id: my_active_signups.select(:run_id))
  end

  def user_con_profiles_in_signed_up_runs
    UserConProfile.where(
      id: Signup.where(run_id: my_active_signups.select(:run_id))
        .where.not(state: 'withdrawn')
        .select(:user_con_profile_id)
    )
  end

  def user_con_profile_ids_in_signed_up_runs
    @user_con_profile_ids_in_signed_up_runs ||= user_con_profiles_in_signed_up_runs.pluck(:id)
  end

  def events_where_signed_up
    Event.where(id: runs_where_signed_up.select(:event_id))
  end
end
