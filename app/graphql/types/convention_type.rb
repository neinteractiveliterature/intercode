# frozen_string_literal: true
class Types::ConventionType < Types::BaseObject
  implements Types::CmsParent
  include CmsParentImplementation

  field :accepting_proposals, Boolean, null: true

  field :bio_eligible_user_con_profiles, [Types::UserConProfileType], null: false
  def bio_eligible_user_con_profiles
    object.user_con_profiles.can_have_bio.includes(:staff_positions, team_members: { event: :convention })
  end

  field :canceled, Boolean, null: false
  field :catch_all_staff_position, Types::StaffPositionType, null: true
  field :clickwrap_agreement, String, null: true

  field :clickwrap_agreement_html, String, null: true
  def clickwrap_agreement_html
    return nil unless object.clickwrap_agreement
    cadmus_renderer.render(Liquid::Template.parse(object.clickwrap_agreement), :html)
  end

  field :cms_content_groups,
        [Types::CmsContentGroupType],
        deprecation_reason: 'Please use `cmsContentGroups` instead.',
        null: false
  field :cms_layouts, [Types::CmsLayoutType], deprecation_reason: 'Please use `cmsLayouts` instead.', null: false
  field :cms_navigation_items,
        [Types::CmsNavigationItemType],
        deprecation_reason: 'Please use `cmsNavigationItems` instead.',
        null: false

  pagination_field :coupons_paginated, Types::CouponsPaginationType, Types::CouponFiltersInputType, null: false

  def coupons_paginated(**args)
    Tables::CouponsTableResultsPresenter
      .for_convention(convention: object, pundit_user: pundit_user, filters: args[:filters].to_h, sort: args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  field :created_at, Types::DateType, null: true
  field :departments, [Types::DepartmentType], null: false
  field :domain, String, null: true
  field :email_from, String, null: false
  field :email_mode, Types::EmailModeType, null: false
  field :ends_at, Types::DateType, null: true

  field :event, Types::EventType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the event to find'
    argument :transitional_id, ID, required: false, description: 'The ID of the event to find', camelize: true

    description <<~MARKDOWN
      Finds an active event by ID in this convention. If there is no event with that ID in this
      convention, or the event is no longer active, errors out.
    MARKDOWN
  end

  def event(**args)
    object.events.active.find(args[:transitional_id] || args[:id])
  end

  field :event_categories, [Types::EventCategoryType], null: false do
    argument :current_ability_can_read_event_proposals, Boolean, required: false, camelize: false
  end

  def event_categories(**args)
    promise = AssociationLoader.for(Convention, :event_categories).load(object)

    if args[:current_ability_can_read_event_proposals]
      promise.then do |event_categories|
        event_categories.select do |category|
          policy(EventProposal.new(event_category: category, convention: convention, status: 'proposed')).read?
        end
      end
    else
      AssociationLoader
        .for(Convention, :event_categories)
        .load(object)
        .then do |event_categories|
          # reading #proposable? will attempt to n+1 these if we don't do this
          ::ActiveRecord::Associations::Preloader.new.preload(event_categories, :event_proposal_form)
          event_categories
        end
    end
  end

  field :event_proposal, Types::EventProposalType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the event proposal to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the event proposal to find.', camelize: true

    description <<~MARKDOWN
      Finds an event proposal by ID in this convention. If there is no event proposal with that ID
      in this convention, errors out.
    MARKDOWN
  end

  def event_proposal(**args)
    object.event_proposals.find(args[:transitional_id] || args[:id])
  end

  pagination_field :event_proposals_paginated, Types::EventProposalsPaginationType, Types::EventProposalFiltersInputType

  def event_proposals_paginated(**args)
    Tables::EventProposalsTableResultsPresenter
      .for_convention(object, pundit_user, args[:filters].to_h, args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  field :event_mailing_list_domain, String, null: true

  field :events, [Types::EventType], null: false do
    description <<~MARKDOWN
      Returns all active events in convention associated with the domain name of this HTTP request.
      Filterable by a range of start/finish times.

      **CAUTION:** this query can return a lot of data and take a long time. Please be careful
      when using it.
    MARKDOWN

    argument :extended_counts, Boolean, required: false, deprecation_reason: 'This no longer does anything.'
    argument :include_dropped,
             Boolean,
             required: false,
             description: 'If true, includes dropped events in addition to active events.'
    argument :start,
             Types::DateType,
             required: false,
             description:
               "If present, only returns events that occur at this time or later. \
(These events may have started before that time, but will still be ongoing during it.)"
    argument :finish,
             Types::DateType,
             required: false,
             description:
               "If present, only returns events that occur earlier than this time \
(non-inclusive.) These events may end after this time, but start before it."
  end

  def events(include_dropped: false, start: nil, finish: nil, **_args)
    events = object.events
    events = events.active unless include_dropped

    if start || finish
      return Event.none unless policy(Run.new(event: Event.new(convention: object))).read?
      events.with_runs_between(convention, start, finish)
    else
      events
    end
  end

  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType

  def events_paginated(**args)
    Tables::EventsTableResultsPresenter
      .for_convention(convention: object, pundit_user: pundit_user, filters: args[:filters].to_h, sort: args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  field :form, Types::FormType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the form to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the form to find.', camelize: true

    description <<~MARKDOWN
      Finds a form by ID in this convention. If there is no form with that ID in this convention,
      errors out.
    MARKDOWN
  end

  def form(**args)
    object.forms.find(args[:transitional_id] || args[:id])
  end

  field :forms, [Types::FormType], null: false
  field :hidden, Boolean, null: false
  field :id,
        Integer,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :language, String, null: false
  field :location, Types::JSON, null: true

  field :mailing_lists, Types::MailingListsType, null: false

  def mailing_lists
    MailingListsPresenter.new(object)
  end

  field :maximum_event_signups, Types::ScheduledValueType, null: true
  field :maximum_tickets, Integer, null: true

  field :my_profile, Types::UserConProfileType, null: true do
    description <<~MARKDOWN
      Returns the convention-specific profile for the current user within this convention. If no
      user is signed in, returns null.
    MARKDOWN
  end

  def my_profile
    @my_profile ||=
      if object == context[:convention]
        # Avoids redundant database queries
        context[:user_con_profile]
      elsif context[:user]
        object.user_con_profiles.find_by(user_id: context[:user].id)
      end
  end

  field :my_signups, [Types::SignupType], null: false, camelize: false do
    description <<~MARKDOWN
      Returns all signups for the current user within this convention. If no user is signed in,
      returns an empty array.
    MARKDOWN
  end

  def my_signups
    my_profile&.signups || []
  end

  field :notification_templates, [Types::NotificationTemplateType], null: false

  field :notifier_liquid_assigns, [Types::LiquidAssign], null: false do
    argument :event_key,
             String,
             required: true,
             description: 'The key of the notification event to use for generating assigns.'

    description <<~MARKDOWN
      Returns all the Liquid assigns for rendering a particular notification event in this
      convention. This is a combination of globally-accessible Liquid assigns, values specific
      to that notification event, and convention-specific user-defined CMS variables.
    MARKDOWN
  end

  def notifier_liquid_assigns(event_key:)
    notifier = NotifierPreviewFactory.new(convention: object, event_key: event_key).notifier
    LiquidAssignGraphqlPresenter.from_hash(notifier.liquid_assigns)
  end

  field :name, String, null: false

  field :orders,
        Types::OrdersConnectionType,
        max_page_size: 1000,
        null: true,
        connection: true,
        deprecation_reason:
          "Deprecated for potential performance implications.  Please use \
`orders_paginated` instead." do
    authorize do |value, _args, context|
      Pundit.policy(context[:pundit_user], Order.new(user_con_profile: UserConProfile.new(convention: value))).read?
    end
  end

  def orders
    object.orders.where.not(status: 'pending').includes(order_entries: %i[product product_variant])
  end

  pagination_field :orders_paginated, Types::OrdersPaginationType, Types::OrderFiltersInputType

  def orders_paginated(filters: nil, sort: nil, page: nil, per_page: nil)
    scope =
      policy_scope(object.orders.where.not(status: 'pending').includes(order_entries: %i[product product_variant]))

    Tables::OrdersTableResultsPresenter.new(scope, filters.to_h, sort).paginate(page: page, per_page: per_page)
  end

  field :organization, Types::OrganizationType, null: true
  field :pages, [Types::PageType], null: false, deprecation_reason: 'This field is being renamed to `cmsPages`.'

  field :pre_schedule_content_html, String, null: true

  def pre_schedule_content_html
    partial = object.cms_partials.find_by(name: 'pre_schedule_text')
    return nil unless partial
    context[:cadmus_renderer].render(Liquid::Template.parse(partial.content), :html)
  end

  field :preview_notifier_liquid, String, null: false do
    argument :event_key,
             String,
             required: true,
             description: 'The key of the notification event to use for generating the preview.'
    argument :content, String, required: true, description: 'The Liquid content to render.'

    description <<~MARKDOWN
      Given a Liquid text string and a notification event, renders the Liquid to HTML using the
      current domain's CMS context as if it were the content for that notification type.
    MARKDOWN

    authorize { |value, _args, context| Pundit.policy(context[:pundit_user], value).view_reports? }
  end

  def preview_notifier_liquid(event_key:, content:)
    notifier = NotifierPreviewFactory.new(convention: object, event_key: event_key).notifier
    notifier.cadmus_renderer.render(Liquid::Template.parse(content), :html, assigns: notifier.liquid_assigns)
  end

  field :product, Types::ProductType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the product to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the product to find.', camelize: true

    description <<~MARKDOWN
      Finds a product by ID in this convention. If there is no product with that ID in this
      convention, errors out.
    MARKDOWN
  end

  def product(id: nil, transitional_id: nil)
    policy_scope(object.products).find(transitional_id || id)
  end

  field :products, [Types::ProductType], null: false do
    argument :only_ticket_providing, Boolean, required: false, camelize: false
    argument :only_available, Boolean, required: false, camelize: false
  end

  def products(only_ticket_providing: false, only_available: false)
    return AssociationLoader.for(Convention, :products).load(object) if !only_ticket_providing && !only_available

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

  field :run, Types::RunType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the run to find'
    argument :transitional_id, ID, required: false, description: 'The ID of the run to find', camelize: true

    description <<~MARKDOWN
      Finds an active run by ID in this convention. If there is no run with that ID in this
      convention, or the run's event is no longer active, errors out.
    MARKDOWN
  end

  def run(**args)
    Run.where(event_id: object.events.active.select(:id)).find(args[:transitional_id] || args[:id])
  end

  field :staff_positions, [Types::StaffPositionType], null: false
  field :show_event_list, Types::ShowScheduleType, null: true
  field :show_schedule, Types::ShowScheduleType, null: true

  field :signup, Types::SignupType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the signup to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the signup to find.', camelize: true

    description <<~MARKDOWN
      Finds a signup by ID in this convention. If there is no signup with that ID in this
      convention, errors out.
    MARKDOWN
  end

  def signup(**args)
    object.signups.find(args[:transitional_id] || args[:id])
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
        convention.signup_changes.includes(
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

  field :signup_counts_by_state, [Types::SignupCountByStateType], null: false do
    authorize_action :view_reports
  end

  def signup_counts_by_state
    object.signups.group(:state).count.map { |(state, count)| { state: state, count: count } }
  end

  field :signup_mode, Types::SignupModeType, null: false
  field :signup_requests_open, Boolean, null: false

  pagination_field :signup_requests_paginated,
                   Types::SignupRequestsPaginationType,
                   Types::SignupRequestFiltersInputType,
                   null: false

  def signup_requests_paginated(**args)
    Tables::SignupRequestsTableResultsPresenter
      .for_convention(convention: object, pundit_user: pundit_user, filters: args[:filters].to_h, sort: args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field(
    :signup_spy_paginated,
    Types::SignupsPaginationType,
    Types::SignupFiltersInputType,
    null: false,
    deprecation_reason: 'Use signup_changes_paginated instead'
  ) { authorize_action :view_reports }

  def signup_spy_paginated(**args)
    Tables::SignupsTableResultsPresenter
      .signup_spy_for_convention(object, pundit_user)
      .paginate(page: args[:page], per_page: args[:per_page])
  end

  field :site_mode, Types::SiteModeType, null: false

  field :staff_position, Types::StaffPositionType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the staff position to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the staff position to find.', camelize: true

    description <<~MARKDOWN
      Finds a staff position by ID in this convention. If there is no staff position with that ID
      in this convention, errors out.
    MARKDOWN
  end

  def staff_position(id: nil, transitional_id: nil)
    convention.staff_positions.find(transitional_id || id)
  end

  field :starts_at, Types::DateType, null: true
  field :stripe_account_ready_to_charge, Boolean, null: false
  field :stripe_account, Types::StripeAccountType, null: true do
    authorize_action :update
  end
  field :ticket_mode, Types::TicketModeType, null: false
  field :ticket_name, String, null: false
  field :ticket_types, [Types::TicketTypeType], null: false
  field :tickets_available_for_purchase, Boolean, null: false, method: :tickets_available_for_purchase?
  field :timezone_mode, Types::TimezoneModeType, null: false
  field :timezone_name, String, null: true
  field :updated_at, Types::DateType, null: true
  field :user_activity_alert, Types::UserActivityAlertType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false
    argument :transitional_id, ID, required: false, camelize: true
  end

  def user_activity_alert(id: nil, transitional_id: nil)
    RecordLoader.for(UserActivityAlert, where: { convention_id: object.id }).load(transitional_id || id)
  end
  field :user_activity_alerts, [Types::UserActivityAlertType], null: false

  field :user_con_profile, Types::UserConProfileType, null: false do
    argument :id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The ID of the UserConProfile to find.'
    argument :transitional_id, ID, required: false, description: 'The ID of the UserConProfile to find.', camelize: true

    description <<~MARKDOWN
      Finds a UserConProfile by ID in the convention associated with this convention. If there is
      no UserConProfile with that ID in this convention, errors out.
    MARKDOWN
  end

  def user_con_profile(**args)
    object.user_con_profiles.find(args[:transitional_id] || args[:id])
  end

  field :user_con_profile_by_user_id, Types::UserConProfileType, null: false do
    argument :user_id,
             Integer,
             deprecation_reason:
               "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
             required: false,
             description: 'The user ID of the UserConProfile to find.'
    argument :transitional_user_id,
             ID,
             required: false,
             description: 'The user ID of the UserConProfile to find.',
             camelize: true

    description <<~MARKDOWN
      Finds a UserConProfile by user ID in the convention associated with this convention. If
      there is no UserConProfile with that user ID in this convention, errors out.
    MARKDOWN
  end

  def user_con_profile_by_user_id(user_id: nil, transitional_user_id: nil)
    object.user_con_profiles.find_by!(user_id: transitional_user_id || user_id)
  end

  field :user_con_profile_form, Types::FormType, null: false

  pagination_field :user_con_profiles_paginated,
                   Types::UserConProfilesPaginationType,
                   Types::UserConProfileFiltersInputType

  def user_con_profiles_paginated(**args)
    Tables::UserConProfilesTableResultsPresenter
      .for_convention(object, pundit_user, args[:filters].to_h, args[:sort])
      .paginate(page: args[:page], per_page: args[:per_page])
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
