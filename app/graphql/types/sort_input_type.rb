# frozen_string_literal: true
class Types::SortInputType < Types::BaseInputObject
  description <<~MARKDOWN
    A description of a field to sort a result set by. This is typically used in pagination
    fields to specify how the results should be ordered.
  MARKDOWN

  argument :desc, Boolean, required: true do
    description <<~MARKDOWN
      If true, the field will be sorted in descending order. If false, it will be sorted in
      ascending order.
    MARKDOWN
  end
  argument :field, String, required: true, description: "The name of the field to sort by."
end
