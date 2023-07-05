# frozen_string_literal: true
class Types::RunType < Types::BaseObject
  authorize_record

  field :id, ID, null: false
  field :event, Types::EventType, null: false

  def event
    AssociationLoader
      .for(Run, :event)
      .load(object)
      .then { |event| AssociationLoader.for(Event, :convention).load(event).then { |_convention| event } }
  end

  field :starts_at, Types::DateType, null: false
  field :ends_at, Types::DateType, null: false
  field :title_suffix, String, null: true
  field :schedule_note, String, null: true

  field :rooms, [Types::RoomType], null: false

  association_loaders Run, :rooms

  field :room_names, [String], null: false

  def room_names
    RunRoomNamesLoader.for.load(object)
  end

  field :confirmed_signup_count, Integer, null: false

  def confirmed_signup_count
    SignupCountLoader.for.load(object).then { |presenter| presenter.counted_signups_by_state('confirmed') }
  end

  field :confirmed_limited_signup_count, Integer, null: false

  def confirmed_limited_signup_count
    SignupCountLoader.for.load(object).then(&:confirmed_limited_count)
  end

  field :waitlisted_signup_count, Integer, null: false

  def waitlisted_signup_count
    SignupCountLoader.for.load(object).then(&:waitlist_count)
  end

  field :not_counted_signup_count, Integer, null: false

  def not_counted_signup_count
    SignupCountLoader
      .for
      .load(object)
      .then do |presenter|
        (presenter.not_counted_signups_by_state('confirmed') + presenter.not_counted_signups_by_state('waitlisted'))
      end
  end

  field :not_counted_confirmed_signup_count, Integer, null: false

  def not_counted_confirmed_signup_count
    SignupCountLoader.for.load(object).then { |presenter| presenter.not_counted_signups_by_state('confirmed') }
  end

  field :grouped_signup_counts, [Types::GroupedSignupCountType], null: false

  def grouped_signup_counts
    SignupCountLoader.for.load(object).then(&:grouped_signup_counts)
  end

  field :signup_count_by_state_and_bucket_key_and_counted,
        Types::JSON,
        null: false,
        deprecation_reason: 'Please use grouped_signup_counts instead'

  def signup_count_by_state_and_bucket_key_and_counted
    SignupCountLoader.for.load(object).then(&:signup_count_by_state_and_bucket_key_and_counted)
  end

  field :my_signups, [Types::SignupType], null: false

  def my_signups
    return [] unless context[:user_con_profile]
    MySignupsLoader.for(context[:user_con_profile]).load(object)
  end

  field :my_signup_requests, [Types::SignupRequestType], null: false

  def my_signup_requests
    return [] unless context[:user_con_profile]
    MySignupRequestsLoader.for(context[:user_con_profile]).load(object)
  end

  field :current_ability_can_signup_summary_run, Boolean, null: false

  def current_ability_can_signup_summary_run
    ModelPermissionLoader.for(Run).load([pundit_user, :signup_summary, object.id])
  end

  field :signups_paginated, Types::SignupsPaginationType, null: false do
    argument :page, Integer, required: false
    argument :per_page, Integer, required: false, camelize: false
    argument :filters, Types::SignupFiltersInputType, required: false
    argument :sort, [Types::SortInputType, { null: true }], required: false
  end

  def signups_paginated(**args)
    scope = object.signups.includes(:user_con_profile)

    Tables::SignupsTableResultsPresenter
      .new(scope, pundit_user, args[:filters].to_h, args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
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

    Tables::SignupChangesTableResultsPresenter
      .new(scope, args[:filters].to_h, args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
  end
end
