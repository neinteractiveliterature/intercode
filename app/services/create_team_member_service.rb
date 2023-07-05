# frozen_string_literal: true
class CreateTeamMemberService < CivilService::Service
  include SkippableAdvisoryLock

  class Result < CivilService::Result
    attr_accessor :team_member, :ticket, :converted_signups, :move_results
  end
  self.result_class = Result

  attr_reader :event, :user_con_profile, :team_member_attrs, :provide_ticket_type_id

  def initialize(event:, user_con_profile:, team_member_attrs:, provide_ticket_type_id: nil)
    @event = event
    @user_con_profile = user_con_profile
    @team_member_attrs = team_member_attrs.to_h
    @provide_ticket_type_id = provide_ticket_type_id
  end

  private

  def inner_call
    team_member =
      event.team_members.create!(
        team_member_attrs.merge(user_con_profile: user_con_profile, updated_by: user_con_profile.user)
      )

    ticket = provide_ticket_if_applicable
    converted_signups, move_results = convert_signups

    success(team_member: team_member, ticket: ticket, converted_signups: converted_signups, move_results: move_results)
  end

  def provide_ticket_if_applicable
    return unless provide_ticket_type_id
    result = ProvideEventTicketService.new(event, user_con_profile, ticket_type).call!
    result.ticket
  end

  def ticket_type
    return unless provide_ticket_type_id
    @ticket_type ||= event.convention.ticket_types.find(provide_ticket_type_id)
  end

  def convert_signups
    convertible_signups =
      Signup
        .joins(:run)
        .includes(:run)
        .where(user_con_profile_id: user_con_profile.id, runs: { event_id: event.id })
        .where(state: %w[confirmed waitlisted])
        .to_a

    move_results = convertible_signups.flat_map { |signup| convert_signup(signup) }

    [convertible_signups, move_results]
  end

  def convert_signup(signup)
    creates_vacancy = signup.counted? && signup.occupying_slot?

    with_advisory_lock_unless_skip_locking("run_#{signup.run.id}_signups") do
      prior_bucket_key = signup.bucket_key
      signup.update!(state: 'confirmed', bucket_key: nil, counted: false)
      if creates_vacancy
        result = EventVacancyFillService.new(signup.run, prior_bucket_key, skip_locking: true).call!
        result.move_results
      end
    end
  end
end
