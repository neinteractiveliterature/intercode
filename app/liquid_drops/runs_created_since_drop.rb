# frozen_string_literal: true
# A magical container for finding the runs that were created since a certain date.
# @example Retrieving the runs created since a certain date
#   {{ convention.runs_created_since["2018-11-03T00:00:00-05:00"] }}
class RunsCreatedSinceDrop < Liquid::Drop
  # @api
  attr_reader :convention

  # @api
  def initialize(convention)
    @convention = convention
  end

  # @api
  def liquid_method_missing(date)
    return [] unless date
    return invoke_drop(DateTime.iso8601(date)) if date.is_a?(String)
    convention
      .runs
      .joins(:event)
      .where(created_at: date.., events: { status: "active" })
      .includes(event: [:event_category, { team_members: :user_con_profile }])
      .to_a
  end
end
