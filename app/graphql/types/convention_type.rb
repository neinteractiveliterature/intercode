# frozen_string_literal: true
class Types::ConventionType < Types::BaseObject # rubocop:disable Metrics/ClassLength
  description <<~MARKDOWN
    A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
    real-world convention (and this is probably the most common use case), but it can also represent a single event
    (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).

    They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
    them as "web site."
  MARKDOWN

  implements Types::CmsParent
  include CmsParentImplementation

  field :accepting_proposals, Boolean, null: true do
    description "Is this convention currently accepting event proposals?"
  end
  field :bio_eligible_user_con_profiles, [Types::UserConProfileType], null: false do
    description "User profiles in this convention that can have a bio (because they're staff or event team members)."
  end
  field :canceled, Boolean, null: false, description: "Is this convention canceled?"
  field :catch_all_staff_position, Types::StaffPositionType, null: true do
    description <<~MARKDOWN
      If this convention's email_mode is set to staff_emails_to_catch_all, all email sent to staff position email
      addresses at this convention will be forwarded to this staff position.
    MARKDOWN
  end
  field :clickwrap_agreement, String, null: true do
    description <<~MARKDOWN
      A clickwrap agreement, in Liquid format.  If present, users will have to agree to this before they're allowed to
      use the web site.
    MARKDOWN
  end
  field :clickwrap_agreement_html, String, null: true do # rubocop:disable GraphQL/ExtractType
    description "The value of clickwrap_agreement, rendered as HTML."
  end
  field :created_at, Types::DateType, null: true, description: "When this convention was created."
  field :default_currency_code, String, null: true do
    description "The ISO 4217 currency code used by default for products in this convention.  If null, defaults to USD."
  end
  field :departments, [Types::DepartmentType], null: false, description: "All the departments in this convention."
  field :domain, String, null: true, description: "The domain name used for serving this convention web site."
  field :email_from, String, null: false, description: "The default address that site emails will be sent from."
  field :email_mode, Types::EmailModeType, null: false do # rubocop:disable GraphQL/ExtractType
    description "How this convention site will handle incoming emails to its domain."
  end
  field :ends_at, Types::DateType, null: true, description: "When this convention ends."
  field :event, Types::EventType, null: false do
    argument :id, ID, required: true, description: "The ID of the event to find"

    description <<~MARKDOWN
      Finds an active event by ID in this convention. If there is no event with that ID in this
      convention, or the event is no longer active, errors out.
    MARKDOWN
  end
  field :event_categories, [Types::EventCategoryType], null: false do
    argument :current_ability_can_read_event_proposals, Boolean, required: false, camelize: false do
      description "If true, will only return EventCategories where the current user is allowed to read event proposals."
    end

    description "All the EventCategories in this convention."
  end
  field :event_mailing_list_domain, String, null: true do
    description <<~MARKDOWN
      If present, the site will automatically offer to set up forwarding email addresses for event teams under this
      domain.
    MARKDOWN
  end
  field :event_proposal, Types::EventProposalType, null: false do # rubocop:disable GraphQL/ExtractType
    argument :id, ID, required: true, description: "The ID of the event proposal to find."

    description <<~MARKDOWN
      Finds an event proposal by ID in this convention. If there is no event proposal with that ID
      in this convention, errors out.
    MARKDOWN
  end
  field :events, [Types::EventType], null: false do
    description <<~MARKDOWN
      Returns all active events in convention associated with the domain name of this HTTP request.
      Filterable by a range of start/finish times.

      **CAUTION:** this query can return a lot of data and take a long time. Please be careful
      when using it.
    MARKDOWN

    argument :filters,
             Types::EventFiltersInputType,
             required: false,
             description: "If present, filters the returned events."
    argument :finish,
             Types::DateType,
             required: false,
             description:
               "If present, only returns events that occur earlier than this time \
(non-inclusive.) These events may end after this time, but start before it."
    argument :include_dropped,
             Boolean,
             required: false,
             description: "If true, includes dropped events in addition to active events."
    argument :start,
             Types::DateType,
             required: false,
             description:
               "If present, only returns events that occur at this time or later. \
(These events may have started before that time, but will still be ongoing during it.)"
  end
  field :favicon, Types::ActiveStorageAttachmentType, null: true do
    description "The favicon that will be served to browsers on this site."
  end
  field :favicon_url, String, null: true, deprecation_reason: "Please use the favicon field instead." # rubocop:disable GraphQL/FieldDescription
  field :form, Types::FormType, null: false do
    argument :id, ID, required: true, description: "The ID of the form to find."

    description <<~MARKDOWN
      Finds a form by ID in this convention. If there is no form with that ID in this convention,
      errors out.
    MARKDOWN
  end
  field :forms, [Types::FormType], null: false, description: "All the forms in this convention."
  field :hidden, Boolean, null: false do
    description "If true, this convention will not be listed in CMS content on the root site."
  end
  field :id, ID, null: false, description: "The ID of this convention."
  field :language, String, null: false, description: "The language to use for localized content in this site."
  field :location, Types::JSON, null: true, description: "The physical location of the convention, in Mapbox format."
  field :mailing_lists, Types::MailingListsType, null: false do
    description "A sub-object for accessing this convention's autogenerated mailing lists."
  end
  field :maximum_event_signups,
        Types::ScheduledValueType,
        null: true,
        deprecation_reason: "Please use SignupRound instead" do
    description "The schedule of how many signups are allowed in this convention and when."
  end
  field :maximum_tickets, Integer, null: true, description: "The maximum number of tickets this convention can sell." # rubocop:disable GraphQL/ExtractType
  field :my_profile, Types::UserConProfileType, null: true do
    description <<~MARKDOWN
      Returns the convention-specific profile for the current user within this convention. If no
      user is signed in, returns null.
    MARKDOWN
  end
  field :my_signup_ranked_choices, [Types::SignupRankedChoiceType], null: false, camelize: false do
    description <<~MARKDOWN
      Returns all signup ranked choices for the current user within this convention. If no user is signed in,
      returns an empty array.
    MARKDOWN
  end
  field :my_signup_requests, [Types::SignupRequestType], null: false, camelize: false do # rubocop:disable GraphQL/ExtractType
    description <<~MARKDOWN
      Returns all signup requests for the current user within this convention. If no user is signed in,
      returns an empty array.
    MARKDOWN
  end
  field :my_signups, [Types::SignupType], null: false, camelize: false do # rubocop:disable GraphQL/ExtractType
    description <<~MARKDOWN
      Returns all signups for the current user within this convention. If no user is signed in,
      returns an empty array.
    MARKDOWN
  end
  field :name, String, null: false, description: "The name of this convention."
  field :notification_templates, [Types::NotificationTemplateType], null: false do
    description "All the NotificationTemplates in this convention."
  end
  field :notifier_liquid_assigns, [Types::LiquidAssign], null: false do
    argument :event_key,
             String,
             required: true,
             description: "The key of the notification event to use for generating assigns."

    description <<~MARKDOWN
      Returns all the Liquid assigns for rendering a particular notification event in this
      convention. This is a combination of globally-accessible Liquid assigns, values specific
      to that notification event, and convention-specific user-defined CMS variables.
    MARKDOWN
  end
  field :open_graph_image, Types::ActiveStorageAttachmentType, null: true do
    description <<~MARKDOWN
      The image that will be served from this site using the `<meta property="og:image">` tag.  For more information
      about OpenGraph, see https://ogp.me/.
    MARKDOWN
  end
  field :open_graph_image_url, String, null: true, deprecation_reason: "Please use the open_graph_image field instead." # rubocop:disable GraphQL/FieldDescription, GraphQL/ExtractType
  field :organization, Types::OrganizationType, null: true do
    description "The organization in charge of this convention."
  end
  field :pre_schedule_content_html, String, null: true do
    description "If present, a block of HTML content to show above the schedule on various schedule pages."
  end
  field :preview_notifier_liquid, String, null: false do
    argument :content, String, required: true, description: "The Liquid content to render."
    argument :event_key,
             String,
             required: true,
             description: "The key of the notification event to use for generating the preview."

    description <<~MARKDOWN
      Given a Liquid text string and a notification event, renders the Liquid to HTML using the
      current domain's CMS context as if it were the content for that notification type.
    MARKDOWN

    authorize { |value, _args, context| Pundit.policy(context[:pundit_user], value).view_reports? }
  end
  field :product, Types::ProductType, null: false do
    argument :id, ID, required: true, description: "The ID of the product to find."

    description <<~MARKDOWN
      Finds a product by ID in this convention. If there is no product with that ID in this
      convention, errors out.
    MARKDOWN
  end
  field :products, [Types::ProductType], null: false do
    description "Returns the products in this convention."

    argument :only_available, Boolean, required: false, camelize: false do
      description "If true, only returns products that are currently available for purchase."
    end
    argument :only_ticket_providing, Boolean, required: false, camelize: false do
      description "If true, only returns products that provide the buyer a ticket to this convention."
    end
  end
  field :reports, Types::ConventionReportsType, null: false do
    description "A sub-object containing various reports that can be generated for this convention."
    authorize_action :view_reports
  end
  field :rooms, [Types::RoomType], null: false, description: "All the rooms in this convention."
  field :run, Types::RunType, null: false do
    argument :id, ID, required: true, description: "The ID of the run to find"

    description <<~MARKDOWN
      Finds an active run by ID in this convention. If there is no run with that ID in this
      convention, or the run's event is no longer active, errors out.
    MARKDOWN
  end
  field :show_event_list, Types::ShowScheduleType, null: true, description: "Who can currently see the event catalog?"
  field :show_schedule, Types::ShowScheduleType, null: true, description: "Who can currently see the event schedule?" # rubocop:disable GraphQL/ExtractType
  field :signup, Types::SignupType, null: false do
    argument :id, ID, required: true, description: "The ID of the signup to find."

    description <<~MARKDOWN
      Finds a signup by ID in this convention. If there is no signup with that ID in this
      convention, errors out.
    MARKDOWN
  end
  field :signup_automation_mode, Types::SignupAutomationModeType, null: false do
    description "The type of signup automation used for this convention."
  end
  field :signup_counts_by_state, [Types::SignupCountByStateType], null: false do
    description Types::SignupCountByStateType.description
    authorize_action :view_reports
  end
  field :signup_mode, Types::SignupModeType, null: false, description: "The signup mode used for this convention."
  field :signup_requests_open, Boolean, null: false do
    description "In a moderated-signup convention, are signup requests currently allowed?"
  end
  field :signup_rounds, [Types::SignupRoundType], null: false, description: "The signup rounds in this convention." # rubocop:disable GraphQL/ExtractType
  field :site_mode, Types::SiteModeType, null: false, description: "The mode this convention site is operating in."
  field :staff_position, Types::StaffPositionType, null: false do
    argument :id, ID, required: true, description: "The ID of the staff position to find."

    description <<~MARKDOWN
      Finds a staff position by ID in this convention. If there is no staff position with that ID
      in this convention, errors out.
    MARKDOWN
  end
  field :staff_positions, [Types::StaffPositionType], null: false do # rubocop:disable GraphQL/ExtractType
    description "All the staff positions in this convention."
  end
  field :starts_at, Types::DateType, null: true, description: "When this convention starts."
  field :stripe_account, Types::StripeAccountType, null: true do
    description "The Stripe account this convention uses for payments."
    authorize_action :update
  end
  field :stripe_account_id, String, null: true do
    description "The ID of the Stripe account this convention uses for payments."
  end
  field :stripe_account_ready_to_charge, Boolean, null: false do # rubocop:disable GraphQL/ExtractType
    description "Is this convention's Stripe account in a state where the convention can accept payments?"
  end
  field :stripe_publishable_key, String, null: true do # rubocop:disable GraphQL/ExtractType
    description "The publishable key of this convention's Stripe account."
  end
  field :ticket_mode, Types::TicketModeType, null: false do
    description "The mode used for ticket behaviors in this convention."
  end
  field :ticket_name, String, null: false, description: "The word this convention uses for 'ticket'."
  field :ticket_name_plural, String, null: false, camelize: true do
    description "The word this convention uses for 'tickets'."
  end
  field :ticket_types, [Types::TicketTypeType], null: false, description: "All the ticket types in this convention." # rubocop:disable GraphQL/ExtractType
  field :tickets_available_for_purchase, Boolean, null: false, method: :tickets_available_for_purchase? do
    description "Can users currently buy tickets to this convention?"
  end
  field :timezone_mode, Types::TimezoneModeType, null: false do
    description "The mode used for time zone display and time conversion behavior in this site."
  end
  field :timezone_name, String, null: true, description: "The home time zone of this convention." # rubocop:disable GraphQL/ExtractType
  field :updated_at, Types::DateType, null: true, description: "When this convention was last modified."
  field :user_activity_alert, Types::UserActivityAlertType, null: false do
    argument :id, ID, required: true, description: "The ID of the UserActivityAlert to find."

    description "Find a UserActivityAlert by ID."
  end
  field :user_activity_alerts, [Types::UserActivityAlertType], null: false do # rubocop:disable GraphQL/ExtractType
    description "All the UserActivityAlerts in this convention."
  end
  field :user_con_profile, Types::UserConProfileType, null: false do
    argument :id, ID, required: true, description: "The ID of the UserConProfile to find."

    description <<~MARKDOWN
      Finds a UserConProfile by ID in the convention associated with this convention. If there is
      no UserConProfile with that ID in this convention, errors out.
    MARKDOWN
  end
  field :user_con_profile_by_user_id, Types::UserConProfileType, null: false do
    argument :user_id, ID, required: true, description: "The user ID of the UserConProfile to find.", camelize: true

    description <<~MARKDOWN
      Finds a UserConProfile by user ID in the convention associated with this convention. If
      there is no UserConProfile with that user ID in this convention, errors out.
    MARKDOWN
  end
  field :user_con_profile_form, Types::FormType, null: false do # rubocop:disable GraphQL/ExtractType
    description "The form used for user profiles in this convention."
  end

  def bio_eligible_user_con_profiles
    object.user_con_profiles.can_have_bio.includes(:staff_positions, team_members: { event: :convention })
  end

  def clickwrap_agreement_html
    return nil unless object.clickwrap_agreement
    cadmus_renderer.render(Liquid::Template.parse(object.clickwrap_agreement), :html)
  end

  pagination_field :coupons_paginated, Types::CouponsPaginationType, Types::CouponFiltersInputType, null: false

  def coupons_paginated(**args)
    Tables::CouponsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user:,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  def event(id:)
    object.events.active.find(id)
  end

  def event_categories(**args)
    event_categories = dataloader.with(Sources::ActiveRecordAssociation, Convention, :event_categories).load(object)

    if args[:current_ability_can_read_event_proposals]
      event_categories.select do |category|
        policy(EventProposal.new(event_category: category, convention:, status: "proposed")).read?
      end
    else
      # reading #proposable? will attempt to n+1 these if we don't do this
      ::ActiveRecord::Associations::Preloader.new(records: event_categories, associations: :event_proposal_form).call
      event_categories
    end
  end

  def event_proposal(id:)
    object.event_proposals.find(id)
  end

  pagination_field :event_proposals_paginated, Types::EventProposalsPaginationType, Types::EventProposalFiltersInputType

  def event_proposals_paginated(**args)
    Tables::EventProposalsTableResultsPresenter.for_convention(
      object,
      pundit_user,
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  def events(include_dropped: false, start: nil, finish: nil, filters: nil, **_args)
    events = object.events.includes(:event_category)
    events = events.active unless include_dropped

    events =
      if start || finish
        return Event.none unless policy(Run.new(event: Event.new(convention: object))).read?
        events.with_runs_between(convention, start, finish)
      else
        events
      end

    Tables::EventsTableResultsPresenter.new(
      base_scope: events,
      convention:,
      pundit_user:,
      filters: filters&.to_h
    ).scoped
  end

  pagination_field :events_paginated, Types::EventsPaginationType, Types::EventFiltersInputType

  def events_paginated(**args)
    Tables::EventsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user:,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  def favicon
    dataloader.with(Sources::ActiveStorageAttachment, Convention, :favicon).load(object)
  end

  def favicon_url
    object.favicon.url
  end

  def form(id:)
    object.forms.find(id)
  end

  def mailing_lists
    MailingListsPresenter.new(object)
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

  def my_signups
    my_profile&.signups || []
  end

  def my_signup_ranked_choices
    my_profile&.signup_ranked_choices || []
  end

  def my_signup_requests
    my_profile&.signup_requests || []
  end

  def notifier_liquid_assigns(event_key:)
    notifier = NotifierPreviewFactory.new(convention: object, event_key:).notifier
    LiquidAssignGraphqlPresenter.from_hash(notifier.liquid_assigns)
  end

  def open_graph_image
    dataloader.with(Sources::ActiveStorageAttachment, Convention, :open_graph_image).load(object)
  end

  def open_graph_image_url
    object.open_graph_image.url
  end

  pagination_field :orders_paginated, Types::OrdersPaginationType, Types::OrderFiltersInputType

  def orders_paginated(filters: nil, sort: nil, page: nil, per_page: nil)
    scope =
      policy_scope(object.orders.where.not(status: "pending").includes(order_entries: %i[product product_variant]))

    Tables::OrdersTableResultsPresenter.new(scope, filters.to_h, sort).paginate(page:, per_page:)
  end

  def pre_schedule_content_html
    partial = object.cms_partials.find_by(name: "pre_schedule_text")
    return nil unless partial
    context[:cadmus_renderer].render(Liquid::Template.parse(partial.content), :html)
  end

  def preview_notifier_liquid(event_key:, content:)
    notifier = NotifierPreviewFactory.new(convention: object, event_key:).notifier
    notifier.cadmus_renderer.render(Liquid::Template.parse(content), :html, assigns: notifier.liquid_assigns)
  end

  def product(id:)
    policy_scope(object.products).find(id)
  end

  def products(only_ticket_providing: false, only_available: false)
    if !only_ticket_providing && !only_available
      return dataloader.with(Sources::ActiveRecordAssociation, Convention, :products).load(object)
    end

    scope = convention.products
    scope = scope.ticket_providing if only_ticket_providing
    scope = scope.available if only_available
    scope.to_a
  end

  def reports
    ConventionReportsPresenter.new(object)
  end

  def run(id:)
    Run.where(event_id: object.events.active.select(:id)).find(id)
  end

  pagination_field :runs_paginated, Types::RunsPaginationType, Types::RunFiltersInputType

  def runs_paginated(**args)
    Tables::RunsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user:,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  def signup(id:)
    object.signups.find(id)
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

    Tables::SignupChangesTableResultsPresenter.new(scope, args[:filters].to_h, args[:sort]).paginate(
      page: args[:page],
      per_page: args[:per_page]
    )
  end

  def signup_counts_by_state
    object.signups.group(:state).count.map { |(state, count)| { state:, count: } }
  end

  pagination_field :signup_requests_paginated,
                   Types::SignupRequestsPaginationType,
                   Types::SignupRequestFiltersInputType,
                   null: false

  def signup_requests_paginated(**args)
    Tables::SignupRequestsTableResultsPresenter.for_convention(
      convention: object,
      pundit_user:,
      filters: args[:filters].to_h,
      sort: args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  def staff_position(id:)
    convention.staff_positions.find(id)
  end

  def stripe_publishable_key
    Rails.configuration.stripe[:publishable_key]
  end

  def ticket_name_plural
    object.ticket_name.pluralize
  end

  def user_activity_alert(id:)
    dataloader.with(Sources::ModelById, UserActivityAlert, where: { convention_id: object.id }).load(id)
  end

  def user_con_profile(id:)
    object.user_con_profiles.find(id)
  end

  def user_con_profile_by_user_id(user_id:)
    object.user_con_profiles.find_by!(user_id:)
  end

  pagination_field :user_con_profiles_paginated,
                   Types::UserConProfilesPaginationType,
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
    :signup_rounds,
    :staff_positions,
    :ticket_types,
    :user_activity_alerts
  )
end
