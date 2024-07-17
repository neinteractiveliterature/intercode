# frozen_string_literal: true
class Types::EventCategoryType < Types::BaseObject
  field :can_provide_tickets, Boolean, null: false, camelize: false, method: :can_provide_tickets?
  field :convention, Types::ConventionType, null: false
  field :default_color, String, null: true, camelize: false
  field :department, Types::DepartmentType, null: true
  field :event_form, Types::FormType, null: false, camelize: false
  field :event_proposal_form, Types::FormType, null: true, camelize: false
  field :full_color, String, null: true, camelize: false
  field :id, ID, null: false
  field :name, String, null: false
  field :proposable, Boolean, null: false, method: :proposable?
  field :proposal_description, String, null: true
  field :scheduling_ui, Types::SchedulingUiType, null: false, camelize: false
  field :signed_up_color, String, null: true, camelize: false
  field :team_member_name, String, null: false, camelize: false
  field :team_member_name_plural, String, null: false, camelize: true
  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType, camelize: false

  association_loaders EventCategory, :convention, :department, :event_form, :event_proposal_form

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
