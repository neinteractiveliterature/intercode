class Types::ConventionType < Types::BaseObject
  field :id, Integer, null: false
  field :accepting_proposals, Boolean, null: true
  field :created_at, Types::DateType, null: true
  field :updated_at, Types::DateType, null: true
  field :starts_at, Types::DateType, null: true
  field :ends_at, Types::DateType, null: true
  field :name, String, null: true
  field :domain, String, null: true
  field :event_mailing_list_domain, String, null: true
  field :timezone_name, String, null: true
  field :show_schedule, Types::ShowScheduleType, null: true
  field :show_event_list, Types::ShowScheduleType, null: true
  field :maximum_tickets, Integer, null: true
  field :maximum_event_signups, Types::ScheduledValueType, null: true
  field :ticket_name, String, null: false
  field :user_con_profile_form, Types::FormType, null: false
  field :clickwrap_agreement, String, null: true
  field :stripe_publishable_key, String, null: true
  field :masked_stripe_secret_key, String, null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:update, convention)
    end
  end
  field :forms, [Types::FormType], null: false
  field :cms_layouts, [Types::CmsLayoutType], null: true
  field :default_layout, Types::CmsLayoutType, null: true
  field :cms_navigation_items, [Types::CmsNavigationItemType], null: true
  field :pages, [Types::PageType], null: true
  field :rooms, [Types::RoomType], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, Room.new(convention: convention))
    end
  end
  field :root_page, Types::PageType, null: true
  field :staff_positions, [Types::StaffPositionType], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, StaffPosition.new(convention: convention))
    end
  end
  field :ticket_types, [Types::TicketTypeType], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, TicketType.new(convention: convention))
    end
  end
  field :products, [Types::ProductType], null: true
  field :user_activity_alerts, [Types::UserActivityAlert, null: true], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserActivityAlert.new(convention: convention))
    end
  end

  association_loaders(
    Convention,
    :cms_layouts,
    :cms_navigation_items,
    :default_layout,
    :forms,
    :pages,
    :products,
    :rooms,
    :root_page,
    :staff_positions,
    :ticket_types,
    :user_activity_alerts
  )

  field :event_categories, [Types::EventCategoryType], null: false do
    argument :current_ability_can_read_event_proposals, Boolean, required: false, camelize: false
  end

  def event_categories(**args)
    promise = AssociationLoader.for(Convention, :event_categories).load(object)

    if args[:current_ability_can_read_event_proposals]
      promise.then do |event_categories|
        event_categories.select do |category|
          context[:current_ability].can?(:read, EventProposal.new(event_category: category, status: 'proposed'))
        end
      end
    else
      AssociationLoader.for(Convention, :event_categories).load(object)
    end
  end

  field :privilege_names, [String], null: false

  def privilege_names
    ['site_admin'] + UserConProfile::PRIV_NAMES.to_a
  end

  field :mail_privilege_names, [String], null: false

  def mail_privilege_names
    UserConProfile::MAIL_PRIV_NAMES
  end

  field :user_activity_alert, Types::UserActivityAlert, null: false do
    argument :id, Integer, required: true

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserActivityAlert.new(convention: convention))
    end
  end

  def user_activity_alert(id:)
    RecordLoader.for(UserActivityAlert, where: { convention_id: object.id }).load(id)
  end

  field :orders, Types::OrdersConnectionType, max_page_size: 1000, null: true, connection: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Order.new(user_con_profile: UserConProfile.new(convention: convention))
      )
    end
  end

  def orders
    object.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])
  end

  pagination_field :event_proposals_paginated, Types::EventProposalsPaginationType, Types::EventProposalFiltersInputType do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:view_event_proposals, convention)
    end
  end

  def event_proposals_paginated(**args)
    Tables::EventProposalsTableResultsPresenter.for_convention(
      object,
      context[:current_ability],
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType

  def events_paginated(**args)
    Tables::EventsTableResultsPresenter.for_convention(
      convention: object,
      ability: context[:current_ability],
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field :orders_paginated, Types::OrdersPaginationType, Types::OrderFiltersInputType do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Order.new(user_con_profile: UserConProfile.new(convention: convention))
      )
    end
  end

  def orders_paginated(filters: nil, sort: nil, page: nil, per_page: nil)
    scope = object.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])

    Tables::OrdersTableResultsPresenter.new(scope, filters.to_h, sort)
      .paginate(page: page, per_page: per_page)
  end

  pagination_field :signup_spy_paginated, Types::SignupsPaginationType, Types::UserConProfileFiltersInputType, null: false do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:view_reports, convention)
    end
  end

  def signup_spy_paginated(**args)
    Tables::SignupsTableResultsPresenter.signup_spy_for_convention(object)
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field :user_con_profiles_paginated, Types::UserConProfilesPaginationType, Types::UserConProfileFiltersInputType do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserConProfile.new(convention: convention))
    end
  end

  def user_con_profiles_paginated(**args)
    Tables::UserConProfilesTableResultsPresenter.for_convention(
      object,
      context[:current_ability],
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end
end
