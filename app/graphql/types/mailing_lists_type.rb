class Types::MailingListsType < Types::BaseObject
  def self.authorized?(value, context)
    Pundit.policy(context[:pundit_user], value).mail_to_any?
  end

  field :event_proposers, Types::MailingListsResultType, null: false do
    authorize_action :mail_to_gms
  end

  field :team_members, Types::MailingListsResultType, null: false do
    authorize_action :mail_to_gms
  end

  field :ticketed_attendees, Types::MailingListsResultType, null: false do
    authorize_action :mail_to_attendees
  end

  field :users_with_pending_bio, Types::MailingListsResultType, null: false do
    authorize_action :mail_to_gms
  end

  field :waitlists, [Types::MailingListsWaitlistsResultType], null: false do
    authorize_action :mail_to_attendees
  end

  field :whos_free, Types::MailingListsResultType, null: false do
    argument :start, Types::DateType, required: true
    argument :finish, Types::DateType, required: true
    authorize_action :mail_to_attendees
  end

  def whos_free(start:, finish:)
    object.whos_free(ScheduledValue::Timespan.new(start: start, finish: finish))
  end
end
