# frozen_string_literal: true
class Types::MailingListsType < Types::BaseObject
  def self.authorized?(value, context)
    Pundit.policy(context[:pundit_user], value).read_any_mailing_list?
  end

  field :event_proposers, Types::MailingListsResultType, null: false do
    authorize_action :read_team_members_mailing_list
  end

  field :team_members, Types::MailingListsResultType, null: false do
    authorize_action :read_team_members_mailing_list
  end

  field :ticketed_attendees, Types::MailingListsResultType, null: false do
    authorize_action :read_user_con_profiles_mailing_list
  end

  field :users_with_pending_bio, Types::MailingListsResultType, null: false do
    authorize_action :read_team_members_mailing_list
  end

  field :waitlists, [Types::MailingListsWaitlistsResultType], null: false do
    authorize_action :read_user_con_profiles_mailing_list
  end

  field :whos_free, Types::MailingListsResultType, null: false do
    argument :start, Types::DateType, required: true
    argument :finish, Types::DateType, required: true
    authorize_action :read_user_con_profiles_mailing_list
  end

  def whos_free(start:, finish:)
    object.whos_free(ScheduledValue::Timespan.new(start: start, finish: finish))
  end
end
