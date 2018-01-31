require 'mail'

class MailingListsController < ApplicationController
  class ContactEmail
    attr_reader :email, :name, :metadata

    def initialize(email, name, **metadata)
      @email = email
      @name = name
      @metadata = metadata || {}
    end

    def formatted_address
      address = Mail::Address.new(email)
      address.display_name = name
      address.format
    rescue
      email
    end
  end

  def index
    authorize! :mail_to_any, convention
  end

  def event_proposers
    authorize! :mail_to_gms, convention

    event_proposals = Event.title_sort(convention.event_proposals.where.not(status: [:rejected, :dropped]).includes(:owner))
    @emails = event_proposals.map do |event_proposal|
      ContactEmail.new(event_proposal.email, event_proposal.owner.name_without_nickname, title: event_proposal.title)
    end
    @metadata_fields = [:title]

    render action: 'single_mailing_list'
  end

  def team_members
    authorize! :mail_to_gms, convention

    events = Event.title_sort(convention.events.active.includes(team_members: { user_con_profile: :user }))
    emails_by_event = events.map do |event|
      if event.con_mail_destination == 'event_email'
        [event, [ContactEmail.new(event.email, "#{event.title} Team", event: event.title)]]
      else
        emails = event.team_members.map do |team_member|
          ContactEmail.new(team_member.email, team_member.user_con_profile.name_without_nickname, event: event.title)
        end

        [event, emails]
      end
    end.to_h

    @emails = events.flat_map { |event| emails_by_event[event] }
    @metadata_fields = [:event]

    render action: 'single_mailing_list'
  end

  def users_with_pending_bio
    authorize! :mail_to_gms, convention

    pending_bio_users = convention.user_con_profiles.can_have_bio.reject { |user_con_profile| user_con_profile.bio.present? }
    @emails = pending_bio_users.sort_by(&:name_inverted).map do |user_con_profile|
      ContactEmail.new(user_con_profile.email, user_con_profile.name_inverted)
    end

    render action: 'single_mailing_list'
  end

  def waitlists
    authorize! :mail_to_attendees, convention

    @runs = convention.runs
      .where(id: convention.signups.waitlisted.select(:run_id))
      .includes(signups: :user_con_profile).order(:starts_at)

    @emails_by_run = @runs.map do |run|
      emails = run.signups.waitlisted.map do |signup|
        ContactEmail.new(signup.user_con_profile.email, signup.user_con_profile.name_without_nickname)
      end

      [run, emails]
    end.to_h
  end

  def whos_free
    authorize! :mail_to_attendees, convention

    if params[:start] && params[:finish]
      timespan = ScheduledValue::Timespan.new(start: DateTime.iso8601(params[:start]), finish: DateTime.iso8601(params[:finish]))
      signups_during_timespan = convention.signups.where.not(state: 'withdrawn').includes(run: :event).select do |signup|
        signup.run.timespan.overlaps?(timespan)
      end
      busy_user_con_profile_ids = Set.new(signups_during_timespan.map(&:user_con_profile_id))

      ticketed_user_con_profiles = convention.user_con_profiles.includes(:user).where(receive_whos_free_emails: true).joins(:ticket)
      free_user_con_profiles = ticketed_user_con_profiles
        .reject { |user_con_profile| busy_user_con_profile_ids.include?(user_con_profile.id) }

      @emails = free_user_con_profiles.map do |user_con_profile|
        ContactEmail.new(user_con_profile.email, user_con_profile.name_without_nickname)
      end
    end
  end
end
