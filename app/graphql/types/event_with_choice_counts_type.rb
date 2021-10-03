# frozen_string_literal: true
class Types::EventWithChoiceCountsType < Types::BaseObject
  field :event, Types::EventType, null: false
  field :choice_counts, [Types::ChoiceCountType], null: false
end
