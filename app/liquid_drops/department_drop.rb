# frozen_string_literal: true
# A department in a convention.
class DepartmentDrop < Liquid::Drop
  # @api
  attr_reader :department

  # @!method id
  #   @return [Integer] The numeric database id of the department
  # @!method name
  #   @return [String] The name of the department
  # @!method event_categories
  #   @return [Array<EventCategoryDrop>] The event categories this department manages
  delegate :id, :name, :event_categories, to: :department
end
