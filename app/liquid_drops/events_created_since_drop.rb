# A magical container for finding the events that were created since a certain date.
# @example Retrieving the events created since a certain date
#   {{ convention.events_created_since["2018-11-03T00:00:00-05:00"] }}
class EventsCreatedSinceDrop < Liquid::Drop
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
    convention.events
      .where('created_at >= ?', date)
      .includes(:event_category, :runs, team_members: :user_con_profile)
      .to_a
  end
end
