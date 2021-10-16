# frozen_string_literal: true
class Types::EventCategoryType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :convention, Types::ConventionType, null: false
  field :department, Types::DepartmentType, null: true
  field :name, String, null: false
  field :proposal_description, String, null: true
  field :team_member_name, String, null: false, camelize: false
  field :scheduling_ui, Types::SchedulingUiType, null: false, camelize: false
  field :event_form, Types::FormType, null: false, camelize: false
  field :event_proposal_form, Types::FormType, null: true, camelize: false
  field :default_color, String, null: true, camelize: false
  field :full_color, String, null: true, camelize: false
  field :signed_up_color, String, null: true, camelize: false
  field :can_provide_tickets, Boolean, null: false, camelize: false, method: :can_provide_tickets?
  field :proposable, Boolean, null: false, method: :proposable?
  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType, camelize: false

  association_loaders EventCategory, :convention, :department, :event_form, :event_proposal_form

  def events_paginated(sort: nil, page: nil, per_page: nil, filters: nil)
    Tables::EventsTableResultsPresenter
      .new(
        base_scope: object.events,
        convention: convention,
        pundit_user: pundit_user,
        filters: filters.to_h,
        sort: sort
      )
      .paginate(page: page, per_page: per_page)
  end
end
