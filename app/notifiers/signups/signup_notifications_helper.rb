module Signups::SignupNotificationsHelper
  def team_members_to_notify_for_signup(signup)
    signup.event.team_members.select do |team_member|
      team_member.receive_signup_email != 'no' &&
        !(team_member.receive_signup_email == 'non_waitlist_signups' && signup.waitlisted?)
    end
  end

  def team_members_to_notify_for_move_results(event, move_results)
    no_confirmed_moves = move_results.none? do |move_result|
      move_result.prev_state == 'confirmed' || move_result.state == 'confirmed'
    end

    event.team_members.select do |team_member|
      team_member.receive_signup_email != 'no' &&
        !(team_member.receive_signup_email == 'non_waitlist_signups' && no_confirmed_moves)
    end
  end
end
