class UserSignupConstraints
  attr_reader :user_con_profile
  delegate :convention, :ranked_choice_user_constraints, to: :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def current_signups_including_not_counted
    @current_signups_including_not_counted ||=
      user_con_profile.signups.includes(run: :event).where.not(state: "withdrawn").to_a
  end

  def current_signups
    @current_signups ||=
      current_signups_including_not_counted.select do |signup|
        signup.counted? || (signup.state == "waitlisted" && !signup.requested_bucket&.not_counted?)
      end
  end

  def pending_signup_requests
    @pending_signup_requests ||= user_con_profile.signup_requests.where(state: "pending").to_a
  end

  def current_signup_count
    current_signups.size
  end

  def pending_signup_request_count
    pending_signup_requests.size
  end

  def concurrent_signups_for_run(run)
    current_signups_including_not_counted.select do |signup|
      other_run = signup.run
      !other_run.event.can_play_concurrently? && run.overlaps?(other_run)
    end
  end

  def conflicting_signups_for_run(run, allow_team_member: false)
    if allow_team_member
      # You can be a team member for multiple events at once, as long as you're not also a
      # regular participant in anything that disallows concurrent signups
      concurrent_signups_for_run(run).reject(&:team_member?)
    else
      concurrent_signups_for_run(run)
    end
  end

  def signup_count_allowed?(signup_count)
    case max_signups_allowed
    when "unlimited"
      true
    when "not_yet"
      false
    else
      signup_count <= max_signups_allowed.to_i
    end
  end

  def max_signups_allowed
    @max_signups_allowed ||= convention.maximum_event_signups.value_at(Time.zone.now)
  end

  def has_ticket_if_required? # rubocop:disable Naming/PredicateName
    convention.ticket_mode != "required_for_signup" || user_con_profile.ticket&.allows_event_signups?
  end

  def ranked_choice_user_constraints_at_maximum(timespan)
    applicable_constraints =
      ranked_choice_user_constraints.filter { |constraint| constraint.timespan.overlaps?(timespan) }

    applicable_constraints.filter do |constraint|
      signups_within_constraint = current_signups.filter { |signup| signup.run.timespan.overlaps?(constraint.timespan) }
      signups_within_constraint.size >= constraint.maximum_signups
    end
  end
end
