# frozen_string_literal: true
class Types::EventCategoryType < Types::BaseObject
  description "A kind of event at a convention, which determines its forms, colors and options"
  field :can_provide_tickets,
        Boolean,
        null: false,
        camelize: false,
        method: :can_provide_tickets?,
        description: "Whether events in this category can provide tickets to their team members"
  field :convention,
        Types::ConventionType,
        association_model: EventCategory,
        null: false,
        description: "The convention this category belongs to"
  field :default_color,
        String,
        null: true,
        camelize: false,
        description: "The schedule grid color for events in this category"
  field :department,
        Types::DepartmentType,
        association_model: EventCategory,
        null: true,
        description: "The department that oversees this category, if any"
  field :event_form,
        Types::FormType,
        association_model: EventCategory,
        null: false,
        camelize: false,
        description: "The form used to edit events in this category"
  # rubocop:disable-next GraphQL/ExtractType
  field :event_proposal_form,
        Types::FormType,
        association_model: EventCategory,
        null: true,
        camelize: false,
        description: "The form used to propose events in this category, if proposals are allowed"
  field :full_color,
        String,
        null: true,
        camelize: false,
        description: "The schedule grid color for full runs in this category"
  field :id, ID, null: false, description: "The ID of this event category"
  field :name, String, null: false, description: "The name of this category"
  field :proposable,
        Boolean,
        null: false,
        method: :proposable?,
        description: "Whether people can propose events in this category"
  field :proposal_description,
        String,
        null: true,
        description: "The text describing this category to people proposing events"
  field :scheduling_ui,
        Types::SchedulingUiType,
        null: false,
        camelize: false,
        description: "Which scheduling interface to use for events in this category"
  field :signed_up_color,
        String,
        null: true,
        camelize: false,
        description: "The schedule grid color for runs the viewer is signed up for"
  field :team_member_name,
        String,
        null: false,
        camelize: false,
        description: "What team members of these events are called, such as \"GM\""
  # rubocop:disable-next GraphQL/ExtractType
  field :team_member_name_plural, String, null: false, camelize: true, description: "The plural of the team member name"
  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType, camelize: false

  def events_paginated(sort: nil, page: nil, per_page: nil, filters: nil)
    Tables::EventsTableResultsPresenter.new(
      base_scope: object.events,
      convention:,
      pundit_user:,
      filters: filters.to_h,
      sort:
    ).paginate(page:, per_page:)
  end

  def team_member_name_plural
    object.team_member_name.pluralize
  end
end
