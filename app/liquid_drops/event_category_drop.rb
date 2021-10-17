# frozen_string_literal: true
# A category for events in a convention.  Each event in a convention must belong to a category.
class EventCategoryDrop < Liquid::Drop
  # @api
  attr_reader :event_category

  # @!method id
  #   @return [Integer] The numeric database id of the event category
  # @!method name
  #   @return [String] The name of the event category (e.g. "Panel", "LARP", "Tabletop RPG")
  # @!method scheduling_ui
  #   @return [String] The type of scheduling UI used for this event category (e.g. "regular",
  #                    "single_run", "recurring")
  # @!method team_member_name
  #   @return [String] The name to use for "team members" in this event (e.g. "GM", "panelist")
  delegate :id, :name, :scheduling_ui, :team_member_name, to: :event_category

  # @api
  def initialize(event_category)
    @event_category = event_category
  end
end
