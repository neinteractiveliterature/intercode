# frozen_string_literal: true
class Types::MailingListsType < Types::BaseObject
  description "Mailing lists that convention staff can use to contact groups of people at this convention."

  def self.authorized?(value, context)
    Pundit.policy(context[:pundit_user], value).read_any_mailing_list?
  end

  field :event_proposers, Types::MailingListsResultType, null: false do
    description "The owners of event proposals that have been submitted and not rejected or withdrawn."
    authorize_action :read_team_members_mailing_list
  end

  field :team_members, Types::MailingListsResultType, null: false do
    description <<~MARKDOWN
      The team members of active events, or the event's own email address for events that have one set as their
      convention mail destination.
    MARKDOWN
    argument :event_category_ids,
             [ID],
             required: false,
             description: "If specified, only includes team members of events in these event categories"
    authorize_action :read_team_members_mailing_list
  end

  field :ticketed_attendees, Types::MailingListsResultType, null: false do
    description "Everyone in this convention who has a ticket."
    authorize_action :read_user_con_profiles_mailing_list
  end

  field :users_with_pending_bio, Types::MailingListsResultType, null: false do
    description "People who are eligible to have a bio but haven't written one yet."
    authorize_action :read_team_members_mailing_list
  end

  field :waitlists, [Types::MailingListsWaitlistsResultType], null: false do
    description "For each run that has waitlisted signups, the people who are on its waitlist."
    authorize_action :read_user_con_profiles_mailing_list
  end

  field :whos_free, Types::MailingListsResultType, null: false do
    description <<~MARKDOWN
      Ticketed attendees who have opted in to "who's free" emails and aren't signed up for anything during the given
      time span.
    MARKDOWN
    argument :finish, Types::DateType, required: true, description: "The end of the time span to check"
    argument :start, Types::DateType, required: true, description: "The start of the time span to check"
    authorize_action :read_user_con_profiles_mailing_list
  end

  def team_members(event_category_ids: nil)
    object.team_members(event_category_ids:)
  end

  def whos_free(start:, finish:)
    object.whos_free(ScheduledValue::Timespan.new(start:, finish:))
  end
end
