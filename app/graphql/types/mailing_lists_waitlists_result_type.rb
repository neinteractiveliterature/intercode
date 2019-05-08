class Types::MailingListsWaitlistsResultType < Types::BaseObject
  field :emails, [Types::ContactEmailType], null: false
  field :metadata_fields, [String], null: false
  field :run, Types::RunType, null: false
end
