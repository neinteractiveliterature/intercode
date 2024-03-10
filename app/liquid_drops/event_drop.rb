# frozen_string_literal: true
# An event in a convention.  Events can have one or more runs, depending on their category.
class EventDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :event

  # @!method id
  #   @return [Integer] The numeric database id of the event
  # @!method title
  #   @return [String] The title of the event
  # @!method event_proposal
  #   @return [EventProposalDrop] The proposal associated with this event, if this event went
  #                               through the proposal process
  # @!method author
  #   @return [String] The author of this event
  # @!method organization
  #   @return [String] The organization running this event
  # @!method email
  #   @return [String] The contact email address for this event
  # @!method created_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this event was first created in the
  #                                         database (either by being accepted as a proposal, or)
  #                                         by being created manually by con staff
  delegate :id, :title, :event_proposal, :author, :organization, :email, :event_category, :created_at, to: :event

  # @api
  def initialize(event)
    @event = event
  end

  # @return [Array<UserConProfileDrop>] The UserConProfiles of this event's team members
  def team_member_user_con_profiles
    event.team_members.select(&:display?).map(&:user_con_profile)
  end

  # @return [String] The relative URL to use for linking to this event on this site
  def url
    "/events/#{event.to_param}"
  end

  # @return [String] The external URL for this event, if its team provided one
  def homepage_url
    event.url
  end

  # @return [String] The relative URL to use for linking to the change log for this event
  def history_url
    "/events/#{event.to_param}/history"
  end

  # @return [Array<RunDrop>] The runs of this event
  def runs
    event.runs.to_a
  end

  # @return [ActiveSupport::TimeWithZone] The time at which the earliest run of this event starts
  def first_run_starts_at
    event.runs.min_by(&:starts_at).starts_at
  end

  # @deprecated Please use event_category.name instead.  (Note that the name field on
  #             EventCategoryDrop is formatted as plain English rather than an underscored lowercase
  #             string.)
  # @return [String] The legacy category key of the event (e.g. "larp", "party", "tabletop_rpg")
  def category
    event_category.name.underscore
  end

  # @deprecated Please use event_category.team_member_name instead
  # @return [String] The name to use for "team members" in this event (e.g. "GM", "panelist")
  delegate :team_member_name, to: :event_category

  # @!method description
  #   @return [String] The description of this event, rendered to HTML
  # @!method content_warnings
  #   @return [String] The content warnings for this event, rendered to HTML
  # @!method age_restrictions
  #   @return [String] The age restrictions for this event, rendered to HTML
  # @!method participant_communications
  #   @return [String] The participant communication info for this event, rendered to HTML
  # @!method short_blurb
  #   @return [String] The short blurb for this event, rendered to HTML
  %w[description content_warnings age_restrictions participant_communications short_blurb].each do |field|
    define_method field do
      markdown = event.public_send(field)
      return nil unless markdown
      MarkdownPresenter.new("").render(
        markdown,
        local_images: event.images.includes(:blob).index_by { |image| image.filename.to_s }
      )
    end
  end

  # @return [Hash] This event, represented as a response to the event form set up for this
  #                event category.  This only includes publicly-visible fields; fields not
  #                visible to the public will be replaced with a "this is hidden" message.
  def form_response
    FormResponsePresenter.new(
      event.event_category.event_form,
      event,
      team_member_name: event.event_category.team_member_name,
      controller: @context.registers["controller"]
    ).as_json_with_rendered_markdown("event", event, "")
  end
end
