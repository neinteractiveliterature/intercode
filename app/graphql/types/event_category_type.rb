Types::EventCategoryType = GraphQL::EnumType.define do
  name 'EventCategory'

  Event::CATEGORIES.each do |category|
    value(category)
  end
end
