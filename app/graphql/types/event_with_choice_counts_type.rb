# frozen_string_literal: true
class Types::EventWithChoiceCountsType < Types::BaseObject
  field :choice_counts, [Types::ChoiceCountType], null: false
  field :event, Types::EventType, null: false
end
