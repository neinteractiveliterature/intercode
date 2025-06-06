# frozen_string_literal: true
class Types::QueryType < Types::BaseObject
  field_class Types::BaseField # Camelize fields in this type

  field :convention_by_domain, Types::ConventionType, null: false do
    argument :domain, String, required: true, description: "The domain name to find a convention by."

    description <<~MARKDOWN
    Returns the convention associated with a specified domain name.
  MARKDOWN
  end

  field :email_route, Types::EmailRouteType, null: false, camelize: false do
    description "Returns a global email route by ID."
    argument :id, ID, required: true, description: "The ID of the email route to find."
  end

  field :convention_by_request_host, Types::ConventionType, null: false do
    description <<~MARKDOWN
      Returns the convention associated with the domain name of this HTTP request. If one is not
      present, the request will error out. (For a version that will return null instead of
      erroring out, use `conventionByRequestHostIfPresent`.)
    MARKDOWN
  end

  field :convention_by_request_host_if_present, Types::ConventionType, null: true do
    description <<~MARKDOWN
      Returns the convention associated with the domain name of this HTTP request. If one is not
      present, returns null.
    MARKDOWN
  end

  field :convention_by_id, Types::ConventionType, null: false do
    argument :id, ID, required: false, camelize: true
    description <<~MARKDOWN
    Finds a convention by ID. If a matching one can't be found, the request will error out.
  MARKDOWN
  end

  field :my_authorized_applications, [Types::AuthorizedApplicationType], null: false do
    description <<~MARKDOWN
      Returns the authorized OAuth applications for the current user. If no user is signed in,
      returns null.
    MARKDOWN
  end

  field :current_user, Types::UserType, null: true do
    description <<~MARKDOWN
    Returns the currently signed-in user. If no user is signed in, returns null.
  MARKDOWN
  end

  field :cms_parent_by_request_host, Types::CmsParent, null: false do
    description <<~MARKDOWN
      Returns the CMS parent object associated with the domain name of this HTTP request. In a
      convention domain, this is the `Convention` itself. Otherwise, it's the `RootSite`.
    MARKDOWN
  end

  field :cms_parent_by_domain, Types::CmsParent, null: false do
    argument :domain, String, required: true

    description <<~MARKDOWN
      Returns the CMS parent object associated with a given domain name. In a
      convention domain, this is the `Convention` itself. Otherwise, it's the `RootSite`.
    MARKDOWN
  end

  field :current_ability, Types::AbilityType, null: false do
    description <<~MARKDOWN
      Returns the ability object for the current user's permissions, or an ability object for an
      anonymous user if no user is currently signed in.
    MARKDOWN
  end

  field :assumed_identity_from_profile, Types::UserConProfileType, null: true do
    description <<~MARKDOWN
      If the current user is an assumed identity (using the "become user" feature), this returns
      the actual profile of the signed-in account. If not, returns null.
    MARKDOWN
  end

  field :account_form_content_html,
        String,
        null: true,
        deprecation_reason: "Please use the blockPartial field of CmsParent instead." do
    description <<~MARKDOWN
      If there is a CMS partial on the root site called `account_form_text`, renders it to HTML
      and returns the result. Otherwise, returns null.

      This is used by the "update your account" pages as a way to clarify that your account is
      shared between multiple conventions.
    MARKDOWN
  end

  field :has_oauth_applications, Boolean, null: false do
    description <<~MARKDOWN
      Returns whether or not this instance of Intercode has any third-party OAuth2 applications
      set up. If not, the UI will not show the "Authorized Applications" menu item to users.
    MARKDOWN
  end

  field :notification_events, [Types::NotificationEventType], null: false do
    description <<~MARKDOWN
      Returns a list of all notification events that are available in this instance of Intercode.
    MARKDOWN
  end

  field :oauth_pre_auth, Types::JSON, null: false do
    argument :query_params,
             Types::JSON,
             required: true,
             description:
               "A set of HTTP query parameters for `/oauth/authorize`, parsed out and
represented as a JSON object."

    description <<~MARKDOWN
      Given a set of valid OAuth query parameters for the `/oauth/authorize` endpoint, returns a
      JSON object containing the necessary data for rendering the pre-authorization screen that
      checks if you want to allow an application to access Intercode on your behalf.

      This essentially emulates the JSON behavior of
      [Doorkeeper](https://github.com/doorkeeper-gem/doorkeeper)'s API-only mode if you go to
      `/oauth/authorize` with query parameters. The only reason this query exists, rather than
      simply having clients actually call `/oauth/authorize`, is that we're running Doorkeeper
      in regular mode so that we can get the server-rendered HTML admin views.

      When we've implemented our own admin screens for OAuth
      (see [this Github issue](https://github.com/neinteractiveliterature/intercode/issues/2740)),
      this query will be deprecated.
    MARKDOWN
  end

  field :organizations, [Types::OrganizationType], null: false do
    description <<~MARKDOWN
    Returns all organizations in the database.
  MARKDOWN
  end

  field :root_site, Types::RootSiteType, null: false do
    description <<~MARKDOWN
    Returns the singleton RootSite object, which is a CMS parent.
  MARKDOWN
  end

  field :default_currency_code, String, null: false do
    description "Returns the default currency for this site"
  end

  field :supported_currency_codes, [String], null: false do
    description "Returns a list of all supported currency codes"
  end

  field :user, Types::UserType, null: false do
    argument :id, ID, required: false, description: "The ID of the user to find.", camelize: true

    description <<~MARKDOWN
    Finds a user by ID. If there is no user with that ID, errors out.
  MARKDOWN
  end

  field :users, [Types::UserType], null: false do
    argument :ids, [ID], required: false, description: "The IDs of the users to find."

    description <<~MARKDOWN
    Finds up to 25 users by ID. If any of the IDs don't match an existing user, errors out.
  MARKDOWN
  end

  def convention_by_domain(domain:)
    return context[:convention] if context[:convention]&.domain == domain

    Convention.find_by!(domain:)
  end

  def convention_by_request_host
    unless context[:convention]
      raise ActiveRecord::RecordNotFound,
            "The host name #{context[:controller].request.host} does not belong to a convention"
    end
    context[:convention]
  end

  def convention_by_request_host_if_present
    context[:convention]
  end

  def convention_by_id(id: nil)
    Convention.find(id)
  end

  pagination_field :conventions_paginated,
                   Types::ConventionsPaginationType,
                   Types::ConventionFiltersInputType,
                   camelize: false do
    description <<~MARKDOWN
      Returns a paginated list of conventions. See PaginationInterface for details on how to use
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
                   Types::EmailRoutesPaginationType,
                   Types::EmailRouteFiltersInputType,
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

  def email_route(id:)
    EmailRoute.find(id)
  end

  def my_authorized_applications
    return [] unless current_user
    Doorkeeper::Application.authorized_for(current_user)
  end

  def current_user
    context[:current_user]
  end

  def cms_parent_by_request_host
    context[:convention] || root_site
  end

  def cms_parent_by_domain(domain:)
    Convention.find_by(domain:) || root_site
  end

  def current_ability
    pundit_user
  end

  def notification_events
    Notifier::NOTIFICATIONS_CONFIG
      .fetch("categories")
      .flat_map do |category|
        category
          .fetch("events")
          .map do |event|
            event_key = "#{category["key"]}/#{event["key"]}"
            notifier_class = Notifier::NOTIFIER_CLASSES_BY_EVENT_KEY[event_key]

            {
              key: event_key,
              category: category.fetch("key"),
              allowed_dynamic_destinations: notifier_class.allowed_dynamic_destinations.map(&:to_s),
              allowed_condition_types: notifier_class.allowed_conditions.map(&:to_s)
            }
          end
      end
  end

  def assumed_identity_from_profile
    context[:assumed_identity_from_profile]
  end

  def account_form_content_html
    partial = CmsPartial.global.find_by(name: "account_form_text")
    return nil unless partial
    context[:cadmus_renderer].render(Liquid::Template.parse(partial.content), :html)
  end

  def has_oauth_applications # rubocop:disable Naming/PredicateName
    Doorkeeper::Application.any?
  end

  def oauth_pre_auth(query_params:)
    pre_auth =
      Doorkeeper::OAuth::PreAuthorization.new(
        Doorkeeper.configuration,
        ActionController::Parameters.new(query_params).permit!
      )
    pre_auth.valid?
    pre_auth.as_json({})
  end

  def organizations
    policy_scope(Organization.all)
  end

  def root_site
    RootSite.instance
  end

  def default_currency_code
    Money.default_currency.iso_code
  end

  def supported_currency_codes
    ["EUR"] + EuCentralBank::CURRENCIES
  end

  pagination_field :users_paginated, Types::UsersPaginationType, Types::UserFiltersInputType, camelize: false do
    description <<~MARKDOWN
      Returns a paginated list of users. See PaginationInterface for details on how to use
      paginated lists, and UserFiltersInput for filters you can use here.
    MARKDOWN
  end

  def users_paginated(**args)
    Tables::UsersTableResultsPresenter.new(policy_scope(User.all), args[:filters].to_h, args[:sort]).paginate(
      page: args[:page],
      per_page: args[:per_page]
    )
  end

  def user(id: nil)
    User.find(id)
  end

  def users(ids: nil)
    raise GraphQL::ExecutionError, "Can't retrieve more than 25 users in a single query" if ids.size > 25

    User.find(ids)
  end
end
