# A run of an event
class RunDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :run

  # @!method id
  #   @return [Integer] The numeric database ID of this run
  # @!method event
  #   @return [EventDrop] The event this is a run of
  # @!method starts_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this run starts
  # @!method ends_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this run ends
  # @!method created_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this run was first created in the
  #                                         database (by being scheduled by con staff)
  # @!method length_seconds
  #   @return [Integer] The length of this run in seconds
  delegate :id, :event, :starts_at, :ends_at, :created_at, :length_seconds, to: :run

  # @api
  def initialize(run)
    @run = run
  end

  # @return [String] The relative URL to use for linking to the event's page on the convention site
  def event_url
    "/events/#{event.to_param}"
  end

  # @return [Array<String>] The names of all rooms this run is scheduled in
  def room_names
    run.rooms.map(&:name)
  end

  # @return [String] A text description of the number of signups for this run, split out by
  #                  state and bucket
  def signup_count_description
    SignupCountPresenter.new(run).signups_description
  end
end
