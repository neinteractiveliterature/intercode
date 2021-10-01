class Types::QueryType < Types::BaseObject # rubocop:disable Metrics/ClassLength
  field_class Types::BaseField # Camelize fields in this type

  field :convention, Types::ConventionType, null: true, deprecation_reason: "This field is being \
removed in favor of `conventionByRequestHostIfPresent`." do
    description <<~MARKDOWN
      Returns the convention associated with the domain name of this HTTP request, or null if there
      is none.  (For a version that will either return a convention or error out, use
      `assertConvention`.)
    MARKDOWN
  end

  def convention
    context[:convention]
  end

  field :convention_by_domain, Types::ConventionType, null: false do
    argument :domain, String,
      required: true, description: 'The domain name to find a convention by.'

    description <<~MARKDOWN
      Returns the convention associated with a specified domain name.
    MARKDOWN
  end

  def convention_by_domain(domain:)
    return context[:convention] if context[:convention]&.domain == domain

    Convention.find_by!(domain: domain)
  end

  field :convention_by_request_host, Types::ConventionType, null: false do
    description <<~MARKDOWN
      Returns the convention associated with the domain name of this HTTP request.  If one is not
      present, the request will error out.  (For a version that will return null instead of
      erroring out, use `conventionByRequestHostIfPresent`.)
    MARKDOWN
  end

  def convention_by_request_host
    unless context[:convention]
      raise ActiveRecord::RecordNotFound,
        "The host name #{context[:controller].request.host} does not belong to a convention"
    end
    context[:convention]
  end

  field :convention_by_request_host_if_present, Types::ConventionType, null: true do
    description <<~MARKDOWN
      Returns the convention associated with the domain name of this HTTP request.  If one is not
      present, returns null.
    MARKDOWN
  end

  def convention_by_request_host_if_present
    context[:convention]
  end

  field :assert_convention, Types::ConventionType,
    null: false,
    deprecation_reason: 'This field is being renamed to `conventionByRequestHost`.' do
    description <<~MARKDOWN
      Returns the convention associated with the domain name of this HTTP request.  If one is not
      present, the request will error out.  (For a version that will return null instead of
      erroring out, use `convention`.)
    MARKDOWN
  end

  alias assert_convention convention_by_request_host

  field :convention_by_id, Types::ConventionType, null: false do
    argument :id, Integer, required: true
    description <<~MARKDOWN
      Finds a convention by ID.  If a matching one can't be found, the request will error out.
    MARKDOWN
  end

  def convention_by_id(id:)
    Convention.find(id)
  end

  field :conventions, [Types::ConventionType],
    null: false,
    deprecation_reason: "This field is being removed due to its potential performance \
implications.  Please use conventions_paginated instead." do
    description <<~MARKDOWN
      Returns all conventions in the database.
    MARKDOWN
  end

  def conventions
    Convention.all.to_a
  end

  pagination_field :conventions_paginated,
    Types::ConventionsPaginationType, Types::ConventionFiltersInputType,
    camelize: false do
    description <<~MARKDOWN
      Returns a paginated list of conventions.  See PaginationInterface for details on how to use
      paginated lists, and ConventionFiltersInput for filters you can use here.
    MARKDOWN
  end

  def conventions_paginated(**args)
    Tables::ConventionsTableResultsPresenter.new(
      policy_scope(Convention.all),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field :email_routes_paginated,
    Types::EmailRoutesPaginationType, Types::EmailRouteFiltersInputType,
    camelize: false do
    description <<~MARKDOWN
      Returns a paginated list of the _global_ email routes configured in Intercode.
      (Convention-specific email routing is controlled via that convention's StaffPositions.)
    MARKDOWN
  end

  def email_routes_paginated(**args)
    Tables::EmailRoutesTableResultsPresenter.new(
      policy_scope(EmailRoute.all),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :event, Types::EventType, null: false, deprecation_reason: "Domain-specific queries are \
being deprecated.  Please use the `event` field on the Convention type instead." do
    argument :id, Integer, required: true, description: 'The ID of the event to find'

    description <<~MARKDOWN
      Finds an active event by ID in the convention associated with the domain name of this HTTP
      request.  If there is no event with that ID, or the event is associated with a different
      convention, or the event is no longer active, errors out.
    MARKDOWN
  end

  def event(**args)
    assert_convention.events.active.find(args[:id])
  end

  field :run, Types::RunType, null: false, deprecation_reason: "Domain-specific queries are being
deprecated.  Please use the `run` field on the Convention type instead." do
    argument :id, Integer, required: true, description: 'The ID of the run to find'

    description <<~MARKDOWN
      Finds an active run by ID in the convention associated with the domain name of this HTTP
      request.  If there is no run with that ID, or the run's event is associated with a different
      convention, or the run's event is no longer active, errors out.
    MARKDOWN
  end

  def run(**args)
    Run.where(event_id: assert_convention.events.active.select(:id)).find(args[:id])
  end

  field :runs, [Types::RunType],
    null: false,
    deprecation_reason: "This field is being removed due to its potential performance \
implications.  Please avoid requesting unpaginated lists of all runs.  Instead, use \
`events_paginated` from a Convention object and request the runs from those events." do
    description <<~MARKDOWN
      Returns all runs attached to active events in convention associated with the domain name of
      this HTTP request.
    MARKDOWN
  end

  def runs
    Run.where(event_id: assert_convention.events.active.select(:id))
  end

  field :events, [Types::EventType], null: false, deprecation_reason: "Domain-specific queries are \
being deprecated.  Please use the `events` field on the Convention type instead." do
    description <<~MARKDOWN
      Returns all active events in convention associated with the domain name of this HTTP request.
      Filterable by a range of start/finish times.

      **CAUTION:** this query can return a lot of data and take a long time.  Please be careful
      when using it.
    MARKDOWN

    argument :extended_counts, Boolean,
      required: false, deprecation_reason: 'This no longer does anything.'
    argument :include_dropped, Boolean,
      required: false, description: 'If true, includes dropped events in addition to active events.'
    argument :start, Types::DateType,
      required: false,
      description: "If present, only returns events that occur at this time or later. \
(These events may have started before that time, but will still be ongoing during it.)"
    argument :finish, Types::DateType,
      required: false,
      description: "If present, only returns events that occur earlier than this time \
(non-inclusive.) These events may end after this time, but start before it."
  end

  def events(include_dropped: false, start: nil, finish: nil, **_args)
    events = assert_convention.events
    events = events.active unless include_dropped

    if start || finish
      return Event.none unless policy(Run.new(event: Event.new(convention: convention))).read?
      events.with_runs_between(convention, start, finish)
    else
      events
    end
  end

  field :event_proposal, Types::EventProposalType,
    null: false,
    deprecation_reason: "Domain-specific queries are being deprecated.  Please use the \
`event_proposal` field on the Convention type instead." do
    argument :id, Integer, required: true, description: 'The ID of the event proposal to find.'

    description <<~MARKDOWN
      Finds an event proposal by ID in the convention associated with the domain name of this HTTP
      request.  If there is no event proposal with that ID, or the event proposal is associated
      with a different convention, errors out.
    MARKDOWN
  end

  def event_proposal(**args)
    assert_convention.event_proposals.find(args[:id])
  end

  field :my_signups, [Types::SignupType],
    null: false,
    camelize: false,
    deprecation_reason: "Domain-specific queries are being deprecated.  Please use the \
`my_signups` field on the Convention type instead." do
    description <<~MARKDOWN
      Returns all signups for the current user within the convention associated with the domain name
      of this HTTP request.  If no user is signed in, returns an empty array.
    MARKDOWN
  end

  def my_signups
    context[:user_con_profile]&.signups || []
  end

  field :my_profile, Types::UserConProfileType, null: true, deprecation_reason: "Domain-specific \
queries are being deprecated.  Please use the `my_profile` field on the Convention type instead." do
    description <<~MARKDOWN
      Returns the convention-specific profile for the current user within the convention associated
      with the domain name of this HTTP request.  If no user is signed in, returns null.
    MARKDOWN
  end

  def my_profile
    context[:user_con_profile]
  end

  field :my_authorized_applications, [Types::AuthorizedApplicationType], null: false do
    description <<~MARKDOWN
      Returns the authorized OAuth applications for the current user.  If no user is signed in,
      returns null.
    MARKDOWN
  end

  def my_authorized_applications
    return [] unless current_user
    Doorkeeper::Application.authorized_for(current_user)
  end

  field :current_user, Types::UserType, null: true do
    description <<~MARKDOWN
      Returns the currently signed-in user.  If no user is signed in, returns null.
    MARKDOWN
  end

  def current_user
    context[:current_user]
  end

  field :cms_parent_by_request_host, Types::CmsParent, null: false do
    description <<~MARKDOWN
      Returns the CMS parent object associated with the domain name of this HTTP request.  In a
      convention domain, this is the `Convention` itself.  Otherwise, it's the `RootSite`.
    MARKDOWN
  end

  def cms_parent_by_request_host
    context[:convention] || root_site
  end

  field :cms_parent_by_domain, Types::CmsParent, null: false do
    argument :domain, String, required: true

    description <<~MARKDOWN
      Returns the CMS parent object associated with a given domain name.  In a
      convention domain, this is the `Convention` itself.  Otherwise, it's the `RootSite`.
    MARKDOWN
  end

  def cms_parent_by_domain(domain:)
    Convention.find_by(domain: domain) || root_site
  end

  field :cms_parent, Types::CmsParent, null: false, deprecation_reason: "This query is \
being renamed to `cmsParentByRequestHost`." do
    description <<~MARKDOWN
      Returns the CMS parent object associated with the domain name of this HTTP request.  In a
      convention domain, this is the `Convention` itself.  Otherwise, it's the `RootSite`.
    MARKDOWN
  end

  alias cms_parent cms_parent_by_request_host

  field :search_cms_content, [Types::CmsContentType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `typeaheadSearchCmsContent` field on the CmsParent interface instead." do
    argument :name, String,
      required: false,
      description: "The partial name to search by.  If not specified, returns all CMS content \
within the current domain (limited to 10 results)."

    description <<~MARKDOWN
      Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
      For example, in a convention that has a partial called `attendee_profile` and a page called
      `info_for_attendees`, a search for `attendee` would return both of these.

      This query is always limited to a maximum of 10 results.
    MARKDOWN
  end

  def search_cms_content(name: nil)
    scopes = Types::CmsContentType.possible_types.map do |content_type|
      policy_scope(cms_parent.public_send(content_type.graphql_name.tableize))
    end

    contents = scopes.flat_map do |scope|
      filtered_scope = scope
      if name.present?
        filtered_scope = filtered_scope.where('lower(name) like ?', "%#{name.downcase}%")
      end

      filtered_scope.limit(10).to_a
    end

    contents.sort_by { |content| [content.name.length, content.name] }
  end

  field :cms_content_groups, [Types::CmsContentGroupType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsContentGroups` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS content groups within the current domain.
    MARKDOWN
  end

  delegate :cms_content_groups, to: :cms_parent

  field :cms_content_group, Types::CmsContentGroupType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsContentGroup` field on the CmsParent interface instead." do
    argument :id, Int, required: true, description: 'The ID of the CMS content group to find.'

    description <<~MARKDOWN
      Finds a CMS content group by ID within the domain name of this HTTP request.  If there is no
      CMS content group with that ID, or the CMS content group is associated with a different
      domain name, errors out.
    MARKDOWN
  end

  def cms_content_group(id:)
    cms_parent.cms_content_groups.find(id)
  end

  field :cms_files, [Types::CmsFileType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsFiles` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS files within the current domain.
    MARKDOWN
  end

  def cms_files
    if context[:convention]
      context[:convention].cms_files
    else
      CmsFile.global
    end
  end

  field :cms_pages, [Types::PageType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `searchCmsContent` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS pages within the current domain.
    MARKDOWN
  end

  def cms_pages
    if context[:convention]
      context[:convention].pages
    else
      Page.global
    end
  end

  field :cms_page, Types::PageType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsPage` field on the CmsParent interface instead." do
    argument :id, Int, required: false, description: 'The ID of the page to find.'
    argument :slug, String, required: false, description: 'The unique slug of the page to find.'
    argument :root_page, Boolean,
      required: false,
      description: 'If true, returns the root page for this domain.'

    description <<~MARKDOWN
      Finds a CMS page within the domain name of this HTTP request.  Exactly one of the three
      optional arguments (`id`, `slug`, and `rootPage`) must be specified.  These each represent a
      different way of finding a page.  If the desired page can't be found within the current
      domain name, errors out.
    MARKDOWN
  end

  def cms_page(id: nil, slug: nil, root_page: false)
    return cms_parent.root_page if root_page
    return cms_parent.pages.find(id) if id
    cms_parent.pages.find_by!(slug: slug)
  end

  field :cms_layouts, [Types::CmsLayoutType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsLayouts` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS layouts within the current domain.
    MARKDOWN
  end

  def cms_layouts
    if context[:convention]
      context[:convention].cms_layouts
    else
      CmsLayout.global
    end
  end

  field :cms_partials, [Types::CmsPartialType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsPartials` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS partials within the current domain.
    MARKDOWN
  end

  def cms_partials
    if context[:convention]
      context[:convention].cms_partials
    else
      CmsPartial.global
    end
  end

  field :cms_variables, [Types::CmsVariable],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsVariables` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS variables within the current domain.
    MARKDOWN
  end

  def cms_variables
    if context[:convention]
      context[:convention].cms_variables
    else
      CmsVariable.global
    end
  end

  field :cms_graphql_queries, [Types::CmsGraphqlQueryType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsGraphqlQueries` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS GraphQL queries within the current domain.
    MARKDOWN
  end

  def cms_graphql_queries
    if context[:convention]
      context[:convention].cms_graphql_queries
    else
      CmsGraphqlQuery.global
    end
  end

  field :cms_navigation_items, [Types::CmsNavigationItemType],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `cmsNavigationItems` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all CMS navigation items within the current domain.
    MARKDOWN
  end

  def cms_navigation_items
    if context[:convention]
      context[:convention].cms_navigation_items
    else
      CmsNavigationItem.global
    end
  end

  field :effective_cms_layout, Types::CmsLayoutType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `effectiveCmsLayout` field on the CmsParent interface instead." do
    argument :path, String,
      required: true,
      description: 'The path to find the effective layout for.'

    description <<~MARKDOWN
      Returns the CMS layout to be used for a particular URL path within the current domain.  (This
      will be the page-specific layout if the URL corresponds to a page with a layout override, or
      the default layout for the domain otherwise.)
    MARKDOWN
  end

  def effective_cms_layout(path:)
    CmsContentFinder.new(context[:convention]).effective_cms_layout(path)
  end

  field :current_ability, Types::AbilityType, null: false do
    description <<~MARKDOWN
      Returns the ability object for the current user's permissions, or an ability object for an
      anonymous user if no user is currently signed in.
    MARKDOWN
  end

  def current_ability
    pundit_user
  end

  field :assumed_identity_from_profile, Types::UserConProfileType, null: true do
    description <<~MARKDOWN
      If the current user is an assumed identity (using the "become user" feature), this returns
      the actual profile of the signed-in account.  If not, returns null.
    MARKDOWN
  end

  def assumed_identity_from_profile
    context[:assumed_identity_from_profile]
  end

  field :account_form_content_html, String, null: true do
    description <<~MARKDOWN
      If there is a CMS partial on the root site called `account_form_text`, renders it to HTML
      and returns the result.  Otherwise, returns null.

      This is used by the "update your account" pages as a way to clarify that your account is
      shared between multiple conventions.
    MARKDOWN
  end

  def account_form_content_html
    partial = CmsPartial.global.find_by(name: 'account_form_text')
    return nil unless partial
    context[:cadmus_renderer].render(Liquid::Template.parse(partial.content), :html)
  end

  field :user_con_profile, Types::UserConProfileType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `user_con_profile` field on the Convention object instead." do
    argument :id, Integer, required: true, description: 'The ID of the UserConProfile to find.'

    description <<~MARKDOWN
      Finds a UserConProfile by ID in the convention associated with the domain name of this HTTP
      request.  If there is no UserConProfile with that ID, or the UserConProfile is associated
      with a different convention, errors out.
    MARKDOWN
  end

  def user_con_profile(**args)
    assert_convention.user_con_profiles.find(args[:id])
  end

  field :form, Types::FormType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `form` field on the Convention object instead." do
    argument :id, Integer, required: true, description: 'The ID of the form to find.'

    description <<~MARKDOWN
      Finds a form by ID in the convention associated with the domain name of this HTTP
      request.  If there is no form with that ID, or the form is associated
      with a different convention, errors out.
    MARKDOWN
  end

  def form(**args)
    assert_convention.forms.find(args[:id])
  end

  field :staff_position, Types::StaffPositionType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `staff_position` field on the Convention object instead." do
    argument :id, Integer, required: true, description: 'The ID of the staff position to find.'

    description <<~MARKDOWN
      Finds a staff position by ID in the convention associated with the domain name of this HTTP
      request.  If there is no staff position with that ID, or the staff position is associated
      with a different convention, errors out.
    MARKDOWN
  end

  def staff_position(id:)
    assert_convention.staff_positions.find(id)
  end

  field :liquid_assigns, [Types::LiquidAssign],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `liquidAssigns` field on the CmsParent interface instead." do
    description <<~MARKDOWN
      Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
      This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
      CMS variables.
    MARKDOWN
  end

  def liquid_assigns
    LiquidAssignGraphqlPresenter.from_hash(context[:cadmus_renderer].default_assigns)
  end

  field :notifier_liquid_assigns, [Types::LiquidAssign],
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `notifier_liquid_assigns` field on the Convention type instead." do
    argument :event_key, String,
      required: true,
      description: 'The key of the notification event to use for generating assigns.'

    description <<~MARKDOWN
      Returns all the Liquid assigns for rendering a particular notification event in the current
      domain name.   This is a combination of globally-accessible Liquid assigns, values specific
      to that notification event, and domain-specific user-defined CMS variables.
    MARKDOWN
  end

  def notifier_liquid_assigns(event_key:)
    notifier = NotifierPreviewFactory.new(convention: convention, event_key: event_key).notifier
    LiquidAssignGraphqlPresenter.from_hash(notifier.liquid_assigns)
  end

  field :preview_form_item, Types::FormItemType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `preview_form_item` field on the FormSection type instead." do
    argument :form_section_id, Int,
      required: true,
      description: 'The ID of the form section to preview the item in.'
    argument :form_item, Types::FormItemInputType,
      required: true,
      description: 'The fields to use for constructing the form item to preview.'

    description <<~MARKDOWN
      Given a form section ID and a FormItemInput, returns a preview version of that form item
      within that section.  This does not actually save the form item.  This is mostly useful
      because of the `rendered_properties` field inside FormItem, which lets clients retrieve
      a rendered HTML version of the Liquid-enabled properties of the form item.
    MARKDOWN
  end

  def preview_form_item(form_section_id:, form_item:)
    form_section = FormSection.find(form_section_id)
    FormItem.new(form_item.to_h.merge(id: 0, form_section: form_section, position: 1))
  end

  field :preview_markdown, String,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `previewMarkdown` field on the CmsParent interface instead." do
    argument :markdown, String, required: true, description: 'The Markdown content to render.'

    description <<~MARKDOWN
      Given a Markdown text string, renders it to HTML using the current domain's CMS context
      and returns the result.
    MARKDOWN
  end

  def preview_markdown(markdown:)
    MarkdownPresenter.new('').render(markdown)
  end

  field :preview_liquid, String,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `previewLiquid` field on the CmsParent interface instead." do
    argument :content, String, required: true, description: 'The Liquid content to render.'

    description <<~MARKDOWN
      Given a Liquid text string, renders it to HTML using the current domain's CMS context
      and returns the result.
    MARKDOWN

    authorize do |_value, _args, context|
      # TODO maybe better permission for this?  Not sure, but for now I'm using view_reports as a
      # proxy for "privileged enough to preview arbitrary Liquid (and therefore access arbitrary
      # Liquid drop data)"
      if context[:convention]
        Pundit.policy(context[:pundit_user], context[:convention]).view_reports?
      else
        context[:current_user].site_admin?
      end
    end
  end

  def preview_liquid(content:)
    cadmus_renderer.render(Liquid::Template.parse(content), :html)
  end

  field :preview_notifier_liquid, String,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `preview_notifier_liquid` field on the Convention type instead." do
    argument :event_key, String,
      required: true,
      description: 'The key of the notification event to use for generating the preview.'
    argument :content, String, required: true, description: 'The Liquid content to render.'

    description <<~MARKDOWN
      Given a Liquid text string and a notification event, renders the Liquid to HTML using the
      current domain's CMS context as if it were the content for that notification type.
    MARKDOWN

    authorize do |_value, _args, context|
      Pundit.policy(context[:pundit_user], assert_convention).view_reports?
    end
  end

  def preview_notifier_liquid(event_key:, content:)
    notifier = NotifierPreviewFactory.new(convention: convention, event_key: event_key).notifier
    notifier.cadmus_renderer.render(
      Liquid::Template.parse(content), :html, assigns: notifier.liquid_assigns
    )
  end

  field :product, Types::ProductType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `product` field on the Convention type instead." do
    argument :id, Integer, required: true, description: 'The ID of the product to find.'

    description <<~MARKDOWN
      Finds a product by ID in the convention associated with the domain name of this HTTP
      request.  If there is no product with that ID, or the product is associated
      with a different convention, errors out.
    MARKDOWN
  end

  def product(id:)
    policy_scope(assert_convention.products).find(id)
  end

  field :oauth_pre_auth, Types::JSON, null: false do
    argument :query_params, Types::JSON,
      required: true,
      description: "A set of HTTP query parameters for `/oauth/authorize`, parsed out and
represented as a JSON object."

    description <<~MARKDOWN
      Given a set of valid OAuth query parameters for the `/oauth/authorize` endpoint, returns a
      JSON object containing the necessary data for rendering the pre-authorization screen that
      checks if you want to allow an application to access Intercode on your behalf.

      This essentially emulates the JSON behavior of
      [Doorkeeper](https://github.com/doorkeeper-gem/doorkeeper)'s API-only mode if you go to
      `/oauth/authorize` with query parameters.  The only reason this query exists, rather than
      simply having clients actually call `/oauth/authorize`, is that we're running Doorkeeper
      in regular mode so that we can get the server-rendered HTML admin views.

      When we've implemented our own admin screens for OAuth
      (see [this Github issue](https://github.com/neinteractiveliterature/intercode/issues/2740)),
      this query will be deprecated.
    MARKDOWN
  end

  def oauth_pre_auth(query_params:)
    pre_auth = Doorkeeper::OAuth::PreAuthorization.new(
      Doorkeeper.configuration,
      ActionController::Parameters.new(query_params)
    )
    pre_auth.valid?
    pre_auth.as_json({})
  end

  field :current_pending_order, Types::OrderType,
    null: true, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `current_pending_order` field on the UserConProfile type instead." do
    description <<~MARKDOWN
      If there is a signed-in user and they have a pending store order open in the convention
      associated with the domain name of this HTTP request, returns that order.  Otherwise, returns
      null.
    MARKDOWN
  end

  def current_pending_order
    context[:current_pending_order]
  end

  field :current_pending_order_payment_intent_client_secret, String,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `payment_intent_client_secret` field on the Order type instead." do
    description <<~MARKDOWN
      If there is a signed-in user and they have a pending store order open in the convention
      associated with the domain name of this HTTP request, this generates a Stripe PaymentIntent
      for that order and returns the client secret from that PaymentIntent.  This can be used to
      start a payment on the client side, for example using Apple Pay or Google Pay.

      If there is no signed-in user, this query will error out.
    MARKDOWN
  end

  def current_pending_order_payment_intent_client_secret
    description = current_pending_order.order_entries.map(&:describe_products).to_sentence
    intent = Stripe::PaymentIntent.create(
      {
        amount: current_pending_order.total_price.fractional,
        currency: current_pending_order.total_price.currency,
        description: "#{description} for #{assert_convention.name}",
        statement_descriptor_suffix: PayOrderService.statement_descriptor_suffix(convention),
        metadata: { order_id: current_pending_order.id }
      },
      stripe_account: assert_convention.stripe_account_id
    )

    intent.client_secret
  end

  field :organizations, [Types::OrganizationType], null: false do
    description <<~MARKDOWN
      Returns all organizations in the database.
    MARKDOWN
  end

  def organizations
    policy_scope(Organization.all)
  end

  field :root_site, Types::RootSiteType, null: false do
    description <<~MARKDOWN
      Returns the singleton RootSite object, which is a CMS parent.
    MARKDOWN
  end

  def root_site
    RootSite.instance
  end

  field :site_search, Types::SearchResultType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `fullTextSearch` field on the CmsParent interface instead." do
    argument :query, String, required: true, description: 'The text to search for.'

    description <<~MARKDOWN
      Does a full-text search on the convention associated with the domain name of this HTTP
      request.
    MARKDOWN
  end

  def site_search(query:)
    SearchResult.full_text_site_search(query, context[:convention]&.id, pundit_user)
  end

  field :signup, Types::SignupType,
    null: false, deprecation_reason: "Domain-specific queries are being deprecated. \
Please use the `signup` field on the Convention type instead." do
    argument :id, Integer, required: true, description: 'The ID of the signup to find.'

    description <<~MARKDOWN
      Finds a signup by ID in the convention associated with the domain name of this HTTP
      request.  If there is no signup with that ID, or the signup is associated
      with a different convention, errors out.
    MARKDOWN
  end

  def signup(**args)
    assert_convention.signups.find(args[:id])
  end

  pagination_field :users_paginated, Types::UsersPaginationType, Types::UserFiltersInputType,
    camelize: false do
    description <<~MARKDOWN
      Returns a paginated list of users.  See PaginationInterface for details on how to use
      paginated lists, and UserFiltersInput for filters you can use here.
    MARKDOWN
  end

  def users_paginated(**args)
    Tables::UsersTableResultsPresenter.new(
      policy_scope(User.all),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :user, Types::UserType, null: false do
    argument :id, Integer, required: true, description: 'The ID of the user to find.'

    description <<~MARKDOWN
      Finds a user by ID.  If there is no user with that ID, errors out.
    MARKDOWN
  end

  def user(id:)
    User.find(id)
  end

  field :users, [Types::UserType], null: false do
    argument :ids, [Integer], required: true, description: 'The IDs of the users to find.'

    description <<~MARKDOWN
      Finds up to 25 users by ID.  If any of the IDs don't match an existing user, errors out.
    MARKDOWN
  end

  def users(ids:)
    if ids.size > 25
      raise GraphQL::ExecutionError, "Can't retrieve more than 25 users in a single query"
    end

    User.find(ids)
  end
end
