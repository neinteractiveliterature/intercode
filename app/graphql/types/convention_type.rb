class Types::ConventionType < Types::BaseObject
  field :accepting_proposals, Boolean, null: true

  field :bio_eligible_user_con_profiles, [Types::UserConProfileType], null: false
  def bio_eligible_user_con_profiles
    object.user_con_profiles.can_have_bio.includes(
      :staff_positions,
      team_members: { event: :convention }
    )
  end

  field :canceled, Boolean, null: false
  field :catch_all_staff_position, Types::StaffPositionType, null: true
  field :clickwrap_agreement, String, null: true

  field :clickwrap_agreement_html, String, null: true
  def clickwrap_agreement_html
    return nil unless object.clickwrap_agreement
    cadmus_renderer.render(Liquid::Template.parse(object.clickwrap_agreement), :html)
  end

  field :cms_content_groups, [Types::CmsContentGroupType], null: false
  field :cms_layouts, [Types::CmsLayoutType], null: false
  field :cms_navigation_items, [Types::CmsNavigationItemType], null: false

  pagination_field :coupons_paginated, Types::CouponsPaginationType,
    Types::CouponFiltersInputType, null: false

  def coupons_paginated(**args)
    Tables::CouponsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user: pundit_user,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :created_at, Types::DateType, null: true
  field :default_layout, Types::CmsLayoutType, null: true
  field :departments, [Types::DepartmentType], null: false
  field :domain, String, null: true
  field :email_from, String, null: false
  field :email_mode, Types::EmailModeType, null: false
  field :ends_at, Types::DateType, null: true
  field :event_categories, [Types::EventCategoryType], null: false do
    argument :current_ability_can_read_event_proposals, Boolean, required: false, camelize: false
  end

  def event_categories(**args)
    promise = AssociationLoader.for(Convention, :event_categories).load(object)

    if args[:current_ability_can_read_event_proposals]
      promise.then do |event_categories|
        event_categories.select do |category|
          policy(
            EventProposal.new(event_category: category, convention: convention, status: 'proposed')
          ).read?
        end
      end
    else
      AssociationLoader.for(Convention, :event_categories).load(object).then do |event_categories|
        # reading #proposable? will attempt to n+1 these if we don't do this
        ::ActiveRecord::Associations::Preloader.new.preload(event_categories, :event_proposal_form)
        event_categories
      end
    end
  end

  pagination_field :event_proposals_paginated, Types::EventProposalsPaginationType,
    Types::EventProposalFiltersInputType

  def event_proposals_paginated(**args)
    Tables::EventProposalsTableResultsPresenter.for_convention(
      object,
      pundit_user,
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :event_mailing_list_domain, String, null: true

  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType

  def events_paginated(**args)
    Tables::EventsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user: pundit_user,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :forms, [Types::FormType], null: false
  field :hidden, Boolean, null: false
  field :id, Integer, null: false
  field :language, String, null: false
  field :location, Types::JSON, null: true

  field :mailing_lists, Types::MailingListsType, null: false

  def mailing_lists
    MailingListsPresenter.new(object)
  end

  field :maximum_event_signups, Types::ScheduledValueType, null: true
  field :maximum_tickets, Integer, null: true
  field :notification_templates, [Types::NotificationTemplateType], null: false
  field :name, String, null: false

  field :orders, Types::OrdersConnectionType, max_page_size: 1000, null: true, connection: true do
    authorize do |value, _args, context|
      Pundit.policy(
        context[:pundit_user],
        Order.new(user_con_profile: UserConProfile.new(convention: value))
      ).read?
    end

    deprecation_reason <<~MARKDOWN
      Deprecated for potential performance implications.  Please use `orders_paginated` instead.
    MARKDOWN
  end

  def orders
    object.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])
  end

  pagination_field :orders_paginated, Types::OrdersPaginationType, Types::OrderFiltersInputType

  def orders_paginated(filters: nil, sort: nil, page: nil, per_page: nil)
    scope = policy_scope(
      object.orders.where.not(status: 'pending')
        .includes(order_entries: [:product, :product_variant])
    )

    Tables::OrdersTableResultsPresenter.new(scope, filters.to_h, sort)
      .paginate(page: page, per_page: per_page)
  end

  field :organization, Types::OrganizationType, null: true
  field :pages, [Types::PageType], null: false

  field :pre_schedule_content_html, String, null: true

  def pre_schedule_content_html
    partial = object.cms_partials.find_by(name: 'pre_schedule_text')
    return nil unless partial
    context[:cadmus_renderer].render(Liquid::Template.parse(partial.content), :html)
  end

  field :products, [Types::ProductType], null: false do
    argument :only_ticket_providing, Boolean, required: false, camelize: false
    argument :only_available, Boolean, required: false, camelize: false
  end

  def products(only_ticket_providing: false, only_available: false)
    if !only_ticket_providing && !only_available
      return AssociationLoader.for(Convention, :products).load(object)
    end

    scope = convention.products
    scope = scope.ticket_providing if only_ticket_providing
    scope = scope.available if only_available
    scope.to_a
  end

  field :reports, Types::ConventionReportsType, null: false do
    authorize_action :view_reports
  end

  def reports
    object
  end

  field :rooms, [Types::RoomType], null: false
  field :root_page, Types::PageType, null: true
  field :staff_positions, [Types::StaffPositionType], null: false
  field :show_event_list, Types::ShowScheduleType, null: true
  field :show_schedule, Types::ShowScheduleType, null: true

  pagination_field(
    :signup_changes_paginated, Types::SignupChangesPaginationType,
    Types::SignupChangeFiltersInputType, null: false
  )

  def signup_changes_paginated(**args)
    scope = SignupChangePolicy::Scope.new(
      pundit_user,
      convention.signup_changes.includes(
        user_con_profile: [:convention, :team_members, :staff_positions],
        run: { event: :convention }
      )
    ).resolve

    Tables::SignupChangesTableResultsPresenter
      .new(scope, args[:filters].to_h, args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  field :signup_counts_by_state, [Types::SignupCountByStateType], null: false do
    authorize_action :view_reports
  end

  def signup_counts_by_state
    object.signups.group(:state).count.map do |(state, count)|
      { state: state, count: count }
    end
  end

  field :signup_mode, Types::SignupModeType, null: false
  field :signup_requests_open, Boolean, null: false

  pagination_field :signup_requests_paginated, Types::SignupRequestsPaginationType,
    Types::SignupRequestFiltersInputType, null: false

  def signup_requests_paginated(**args)
    Tables::SignupRequestsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user: pundit_user,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field(
    :signup_spy_paginated, Types::SignupsPaginationType, Types::SignupFiltersInputType,
    null: false, deprecation_reason: 'Use signup_changes_paginated instead'
  ) do
    authorize_action :view_reports
  end

  def signup_spy_paginated(**args)
    Tables::SignupsTableResultsPresenter.signup_spy_for_convention(object, pundit_user)
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  field :site_mode, Types::SiteModeType, null: false
  field :starts_at, Types::DateType, null: true
  field :stripe_account_ready_to_charge, Boolean, null: false
  field :stripe_account, Types::StripeAccountType, null: true do
    authorize_action :update
  end
  field :ticket_mode, Types::TicketModeType, null: false
  field :ticket_name, String, null: false
  field :ticket_types, [Types::TicketTypeType], null: false
  field :tickets_available_for_purchase, Boolean,
    null: false, method: :tickets_available_for_purchase?
  field :timezone_mode, Types::TimezoneModeType, null: false
  field :timezone_name, String, null: true
  field :updated_at, Types::DateType, null: true
  field :user_activity_alert, Types::UserActivityAlertType, null: false do
    argument :id, Integer, required: true
  end

  def user_activity_alert(id:)
    RecordLoader.for(UserActivityAlert, where: { convention_id: object.id }).load(id)
  end
  field :user_activity_alerts, [Types::UserActivityAlertType], null: false
  field :user_con_profile_form, Types::FormType, null: false

  pagination_field :user_con_profiles_paginated, Types::UserConProfilesPaginationType,
    Types::UserConProfileFiltersInputType

  def user_con_profiles_paginated(**args)
    Tables::UserConProfilesTableResultsPresenter.for_convention(
      object,
      pundit_user,
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  association_loaders(
    Convention,
    :catch_all_staff_position,
    :cms_content_groups,
    :cms_layouts,
    :cms_navigation_items,
    :default_layout,
    :departments,
    :forms,
    :notification_templates,
    :organization,
    :pages,
    :rooms,
    :root_page,
    :staff_positions,
    :ticket_types,
    :user_activity_alerts
  )
end
