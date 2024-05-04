# frozen_string_literal: true
class Types::RunType < Types::BaseObject
  description <<~MARKDOWN
    A run of an event within a convention. Events can have multiple runs of the course of a convention (with some
    exceptions, such as conventions that use single_event site mode).
  MARKDOWN

  authorize_record

  field :confirmed_limited_signup_count, Integer, null: false
  field :confirmed_signup_count, Integer, null: false
  field :current_ability_can_signup_summary_run, Boolean, null: false
  field :ends_at, Types::DateType, null: false
  field :event, Types::EventType, null: false
  field :grouped_signup_counts, [Types::GroupedSignupCountType], null: false
  field :id, ID, null: false
  field :my_signup_ranked_choices, [Types::SignupRankedChoiceType], null: false
  field :my_signup_requests, [Types::SignupRequestType], null: false
  field :my_signups, [Types::SignupType], null: false
  field :not_counted_confirmed_signup_count, Integer, null: false
  field :not_counted_signup_count, Integer, null: false
  field :room_names, [String], null: false
  field :rooms, [Types::RoomType], null: false
  field :schedule_note, String, null: true
  field :signup_count_by_state_and_bucket_key_and_counted,
        Types::JSON,
        null: false,
        deprecation_reason: "Please use grouped_signup_counts instead"
  field :signups_paginated, Types::SignupsPaginationType, null: false do
    argument :filters, Types::SignupFiltersInputType, required: false
    argument :page, Integer, required: false
    argument :per_page, Integer, required: false, camelize: false
    argument :sort, [Types::SortInputType], required: false
  end
  field :starts_at, Types::DateType, null: false
  field :title_suffix, String, null: true
  field :waitlisted_signup_count, Integer, null: false

  def event
    event = dataloader.with(Sources::ActiveRecordAssociation, Run, :event).load(object)
    dataloader.with(Sources::ActiveRecordAssociation, Event, :convention).load(event)
    event
  end

  association_loaders Run, :rooms

  def room_names
    dataloader.with(Sources::RunRoomNames).load(object)
  end

  def confirmed_signup_count
    presenter = dataloader.with(Sources::SignupCount).load(object)
    presenter.signup_count(state: "confirmed", counted: true)
  end

  def confirmed_limited_signup_count
    presenter = dataloader.with(Sources::SignupCount).load(object)
    presenter.confirmed_limited_count
  end

  def waitlisted_signup_count
    presenter = dataloader.with(Sources::SignupCount).load(object)
    presenter.waitlist_count
  end

  def not_counted_signup_count
    presenter = dataloader.with(Sources::SignupCount).load(object)

    (
      presenter.signup_count(state: "confirmed", counted: false) +
        presenter.signup_count(state: "waitlisted", counted: false)
    )
  end

  def not_counted_confirmed_signup_count
    presenter = dataloader.with(Sources::SignupCount).load(object)
    presenter.signup_count(state: "confirmed", counted: false)
  end

  def grouped_signup_counts
    presenter = dataloader.with(Sources::SignupCount).load(object)
    presenter.grouped_signup_counts
  end

  def signup_count_by_state_and_bucket_key_and_counted
    presenter = dataloader.with(Sources::SignupCount).load(object)
    presenter.signup_count_by_state_and_bucket_key_and_counted
  end

  def my_signups
    return [] unless context[:user_con_profile]
    dataloader.with(Sources::MySignups, context[:user_con_profile]).load(object)
  end

  def my_signup_requests
    return [] unless context[:user_con_profile]
    dataloader.with(Sources::MySignupRequests, context[:user_con_profile]).load(object)
  end

  def my_signup_ranked_choices
    return [] unless context[:user_con_profile]
    dataloader.with(Sources::MySignupRankedChoices, context[:user_con_profile]).load(object)
  end

  def current_ability_can_signup_summary_run
    dataloader.with(Sources::ModelPermission, Run).load([pundit_user, :signup_summary, object.id])
  end

  def signups_paginated(**args)
    scope = object.signups.includes(:user_con_profile)

    Tables::SignupsTableResultsPresenter.new(scope, pundit_user, args[:filters].to_h, args[:sort]).paginate(
      page: args[:page],
      per_page: args[:per_page]
    )
  end

  pagination_field(
    :signup_changes_paginated,
    Types::SignupChangesPaginationType,
    Types::SignupChangeFiltersInputType,
    null: false
  )

  def signup_changes_paginated(**args)
    scope =
      SignupChangePolicy::Scope.new(
        pundit_user,
        object.signup_changes.includes(
          user_con_profile: %i[convention team_members staff_positions],
          run: {
            event: :convention
          }
        )
      ).resolve

    Tables::SignupChangesTableResultsPresenter.new(scope, args[:filters].to_h, args[:sort]).paginate(
      page: args[:page],
      per_page: args[:per_page]
    )
  end
end
