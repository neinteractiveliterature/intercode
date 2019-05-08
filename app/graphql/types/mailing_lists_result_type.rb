class Types::MailingListsResultType < Types::BaseObject
  field :emails, [Types::ContactEmailType], null: false
  field :metadata_fields, [String], null: false
end
