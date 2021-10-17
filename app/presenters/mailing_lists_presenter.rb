# frozen_string_literal: true
class MailingListsPresenter
  class Result
    attr_reader :emails, :metadata_fields

    def initialize(emails, metadata_fields = [])
      @emails = emails
      @metadata_fields = metadata_fields.map(&:to_s)
    end
  end

  class WaitlistsResult < Result
    attr_reader :run

    def initialize(run, *args)
      super(*args)
      @run = run
    end
  end

  def self.policy_class
    MailingListsPolicy
  end

  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def event_proposers
    event_proposals =
      convention.event_proposals.where.not(status: %i[draft rejected dropped]).includes(owner: :user).order_by_title

    Result.new(
      event_proposals.map do |event_proposal|
        ContactEmail.new(
          event_proposal.owner.email,
          event_proposal.owner.name_without_nickname,
          title: event_proposal.title
        )
      end,
      [:title]
    )
  end

  def team_members
    events = convention.events.active.includes(team_members: { user_con_profile: :user }).order_by_title

    emails_by_event = events.index_with { |event| team_member_emails_for_event(event) }.to_h

    Result.new(events.flat_map { |event| emails_by_event[event] }, [:event])
  end

  def ticketed_attendees
    user_con_profiles =
      convention.user_con_profiles.joins(:ticket).includes(:user).sort_by { |ucp| ucp.name_inverted.downcase }

    Result.new(ContactEmail.from_user_con_profiles(user_con_profiles))
  end

  def users_with_pending_bio
    pending_bio_users =
      convention
        .user_con_profiles
        .can_have_bio
        .includes(:user)
        .select { |user_con_profile| user_con_profile.bio.blank? }

    Result.new(ContactEmail.from_user_con_profiles(pending_bio_users.sort_by(&:name_inverted)))
  end

  def waitlists
    runs =
      convention
        .runs
        .where(id: convention.signups.waitlisted.select(:run_id))
        .includes(signups: { user_con_profile: :user })
        .order(:starts_at)

    runs.map do |run|
      emails =
        run.signups.select(&:waitlisted?).map { |signup| ContactEmail.from_user_con_profile(signup.user_con_profile) }

      WaitlistsResult.new(run, emails)
    end
  end

  def whos_free(timespan)
    busy_user_con_profile_ids = Set.new(signups_during_timespan(timespan).map(&:user_con_profile_id))
    ticketed_user_con_profiles =
      convention.user_con_profiles.includes(:user).where(receive_whos_free_emails: true).joins(:ticket)
    free_user_con_profiles =
      ticketed_user_con_profiles.reject { |user_con_profile| busy_user_con_profile_ids.include?(user_con_profile.id) }

    Result.new(ContactEmail.from_user_con_profiles(free_user_con_profiles))
  end

  private

  def team_member_emails_for_event(event)
    if event.con_mail_destination == 'event_email' && event.email.present?
      [ContactEmail.new(event.email, "#{event.title} Team", event: event.title)]
    else
      event
        .team_members
        .select(&:receive_con_email)
        .map do |team_member|
          ContactEmail.new(
            team_member.user_con_profile.email,
            team_member.user_con_profile.name_without_nickname,
            event: event.title
          )
        end
    end
  end

  def signups_during_timespan(timespan)
    signups_scope = convention.signups.where.not(state: 'withdrawn').includes(run: :event)
    signups_scope.select { |signup| signup.run.timespan.overlaps?(timespan) }
  end
end
