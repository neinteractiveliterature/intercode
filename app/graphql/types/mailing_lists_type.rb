class Types::MailingListsType < Types::BaseObject
  field :event_proposers, Types::MailingListsResultType, null: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:mail_to_gms, graphql_object.object.convention)
    end
  end

  field :team_members, Types::MailingListsResultType, null: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:mail_to_gms, graphql_object.object.convention)
    end
  end

  field :ticketed_attendees, Types::MailingListsResultType, null: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:mail_to_attendees, graphql_object.object.convention)
    end
  end

  field :users_with_pending_bio, Types::MailingListsResultType, null: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:mail_to_gms, graphql_object.object.convention)
    end
  end

  field :waitlists, [Types::MailingListsWaitlistsResultType], null: false do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:mail_to_gms, graphql_object.object.convention)
    end
  end

  field :whos_free, Types::MailingListsResultType, null: false do
    argument :start, Types::DateType, required: true
    argument :finish, Types::DateType, required: true
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:mail_to_attendees, graphql_object.object.convention)
    end
  end

  def whos_free(start:, finish:)
    object.whos_free(ScheduledValue::Timespan.new(start: start, finish: finish))
  end
end
