# frozen_string_literal: true
class Types::NewAndReturningAttendeesType < Types::BaseObject
  description "A report grouping convention attendees into those new to the organization " \
                "and those who have attended before."

  field :new_attendees, [Types::UserConProfileType], null: false do
    description "Attendees who have never attended a convention in this organization before."
  end
  field :returning_attendees, [Types::UserConProfileType], null: false do
    description "Attendees who have attended at least one previous convention in this organization."
  end
end
