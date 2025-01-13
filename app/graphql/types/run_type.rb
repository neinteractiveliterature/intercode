# frozen_string_literal: true
class Types::RunType < Types::BaseObject
  description <<~MARKDOWN
    A run of an event within a convention. Events can have multiple runs of the course of a convention (with some
    exceptions, such as conventions that use single_event site mode).
  MARKDOWN

  authorize_record

  field :confirmed_limited_signup_count, Integer, null: false do
    description "The number of confirmed signups in limited-signup buckets for this run"
  end
  field :confirmed_signup_count, Integer, null: false do # rubocop:disable GraphQL/ExtractType
    description "The number of confirmed signups (regardless of bucket) for this run"
  end
  field :current_ability_can_signup_summary_run, Boolean, null: false do
    description "Whether or not the current user is allowed to request a signup summary of this run"
  end
  field :ends_at, Types::DateType, null: false do
    description "The time at which this run finishes"
  end
  field :event, Types::EventType, null: false, description: "The event this is a run of"
  field :grouped_signup_counts, [Types::GroupedSignupCountType], null: false do
    description <<~MARKDOWN
      A GroupedSignupCounts object for this run, from which more detailed information about the number of signups can
      be obtained (sliced in various ways).
    MARKDOWN
  end
  field :id, ID, null: false, description: "The ID of this run"
  field :my_signup_ranked_choices, [Types::SignupRankedChoiceType], null: false do
    description "The current user's SignupRankedChoices for this Run"
  end
  field :my_signup_requests, [Types::SignupRequestType], null: false do # rubocop:disable GraphQL/ExtractType
    description "The current user's SignupRequests for this Run"
  end
  field :my_signups, [Types::SignupType], null: false do
    description "The current user's Signups for this Run"
  end
  field :not_counted_confirmed_signup_count, Integer, null: false do
    description "The number of confirmed, but not counted signups for this run"
  end
  field :not_counted_signup_count, Integer, null: false do # rubocop:disable GraphQL/ExtractType
    description "The number of non-counted signups for this run (regardless of confirmation status)"
  end
  field :room_names, [String], null: false, description: "The names of all the rooms this run takes place in"
  field :rooms, [Types::RoomType], null: false, description: "The rooms this run takes place in"
  field :schedule_note, String, null: true do
    description <<~MARKDOWN
      An optional, admin-only note to put on this run.  This note is not visible to most users.
    MARKDOWN
  end
  field :signup_count_by_state_and_bucket_key_and_counted, # rubocop:disable GraphQL/FieldDescription
        Types::JSON,
        null: false,
        deprecation_reason: "Please use grouped_signup_counts instead"
  field :signups_paginated, Types::SignupsPaginationType, null: false do
    description "The signups for this run"

    argument :filters, Types::SignupFiltersInputType, required: false do
      description "Only return objects matching these filters"
    end
    argument :page, Integer, required: false, description: "The number of the page to return (the first page is 1)"
    argument :per_page, Integer, required: false, camelize: false, description: "The number of items to return per page"
    argument :sort, [Types::SortInputType], required: false, description: "Sort the resulting objects"
  end
  field :starts_at, Types::DateType, null: false, description: "The time at which this run starts"
  field :title_suffix, String, null: true do
    description <<~MARKDOWN
      If present, Intercode will append this suffix string to this run whenever it appears in the UI.  This can be
      used to disambiguate between multiple runs of the same event.
    MARKDOWN
  end
  field :waitlisted_signup_count, Integer, null: false do
    description "The number of signups currently on the waitlist for this run"
  end

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
    return [] unless context[:current_user]
    dataloader.with(Sources::MySignups, context[:current_user]).load(object)
  end

  def my_signup_requests
    return [] unless context[:current_user]
    dataloader.with(Sources::MySignupRequests, context[:current_user]).load(object)
  end

  def my_signup_ranked_choices
    return [] unless context[:current_user]
    dataloader.with(Sources::MySignupRankedChoices, context[:current_user]).load(object)
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
