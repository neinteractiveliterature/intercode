class Types::QueryType < Types::BaseObject # rubocop:disable Metrics/ClassLength
  field_class Types::BaseField # Camelize fields in this type

  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :convention, Types::ConventionType, null: true do
    argument :id, Integer, required: false
  end

  def convention(**args)
    if args[:id]
      Convention.find(args[:id])
    else
      context[:convention]
    end
  end

  field :conventions, [Types::ConventionType], null: false

  def conventions
    Convention.all.to_a
  end

  pagination_field :conventions_paginated,
    Types::ConventionsPaginationType, Types::ConventionFiltersInputType,
    camelize: false

  def conventions_paginated(**args)
    Tables::ConventionsTableResultsPresenter.new(
      policy_scope(Convention.all),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  pagination_field :email_routes_paginated,
    Types::EmailRoutesPaginationType, Types::EmailRouteFiltersInputType,
    camelize: false

  def email_routes_paginated(**args)
    Tables::EmailRoutesTableResultsPresenter.new(
      policy_scope(EmailRoute.all),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :event, Types::EventType, null: true do
    argument :id, Integer, required: true
  end

  def event(**args)
    context[:convention].events.active.find(args[:id])
  end

  field :run, Types::RunType, null: true do
    argument :id, Integer, required: true
  end

  def run(**args)
    Run.where(event_id: context[:convention].events.active.select(:id)).find(args[:id])
  end

  field :runs, [Types::RunType], null: true

  def runs
    Run.where(event_id: context[:convention].events.active.select(:id))
  end

  field :events, [Types::EventType], null: false do
    argument :extended_counts, Boolean, required: false
    argument :include_dropped, Boolean, required: false
    argument :start, Types::DateType, required: false
    argument :finish, Types::DateType, required: false
  end

  def events(include_dropped: false, start: nil, finish: nil, **_args)
    events = convention.events
    events = events.active unless include_dropped

    if start || finish
      return Event.none unless policy(Run.new(event: Event.new(convention: convention))).read?
      events.with_runs_between(convention, start, finish)
    else
      events
    end
  end

  field :event_proposal, Types::EventProposalType, null: true do
    argument :id, Integer, required: true
  end

  def event_proposal(**args)
    convention.event_proposals.find(args[:id])
  end

  field :my_signups, [Types::SignupType], null: false, camelize: false

  def my_signups
    context[:user_con_profile]&.signups || []
  end

  field :my_profile, Types::UserConProfileType, null: true

  def my_profile
    context[:user_con_profile]
  end

  field :my_authorized_applications, [Types::AuthorizedApplicationType], null: false

  def my_authorized_applications
    return [] unless current_user
    Doorkeeper::Application.authorized_for(current_user)
  end

  field :current_user, Types::UserType, null: true

  def current_user
    context[:current_user]
  end

  field :cms_parent, Types::CmsParentType, null: false

  def cms_parent
    convention || root_site
  end

  field :search_cms_content, [Types::CmsContentType], null: false do
    argument :name, String, required: false
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

  field :cms_content_groups, [Types::CmsContentGroupType], null: false

  delegate :cms_content_groups, to: :cms_parent

  field :cms_content_group, Types::CmsContentGroupType, null: false do
    argument :id, Int, required: true
  end

  def cms_content_group(id:)
    cms_parent.cms_content_groups.find(id)
  end

  field :cms_files, [Types::CmsFileType], null: true

  def cms_files
    if context[:convention]
      context[:convention].cms_files
    else
      CmsFile.global
    end
  end

  field :cms_pages, [Types::PageType], null: false

  def cms_pages
    if context[:convention]
      context[:convention].pages
    else
      Page.global
    end
  end

  field :cms_page, Types::PageType, null: false do
    argument :id, Int, required: false
    argument :slug, String, required: false
    argument :root_page, Boolean, required: false
  end

  def cms_page(id: nil, slug: nil, root_page: false)
    return cms_parent.root_page if root_page
    return cms_parent.pages.find(id) if id
    cms_parent.pages.find_by!(slug: slug)
  end

  field :cms_layouts, [Types::CmsLayoutType], null: false

  def cms_layouts
    if context[:convention]
      context[:convention].cms_layouts
    else
      CmsLayout.global
    end
  end

  field :cms_partials, [Types::CmsPartialType], null: false

  def cms_partials
    if context[:convention]
      context[:convention].cms_partials
    else
      CmsPartial.global
    end
  end

  field :cms_variables, [Types::CmsVariable], null: true

  def cms_variables
    if context[:convention]
      context[:convention].cms_variables
    else
      CmsVariable.global
    end
  end

  field :cms_graphql_queries, [Types::CmsGraphqlQueryType], null: true

  def cms_graphql_queries
    if context[:convention]
      context[:convention].cms_graphql_queries
    else
      CmsGraphqlQuery.global
    end
  end

  field :cms_navigation_items, [Types::CmsNavigationItemType], null: false

  def cms_navigation_items
    if context[:convention]
      context[:convention].cms_navigation_items
    else
      CmsNavigationItem.global
    end
  end

  field :current_ability, Types::AbilityType, null: false

  field :effective_cms_layout, Types::CmsLayoutType, null: false do
    argument :path, String, required: true
  end

  def effective_cms_layout(path:)
    CmsContentFinder.new(context[:convention]).effective_cms_layout(path)
  end

  def current_ability
    pundit_user
  end

  field :assumed_identity_from_profile, Types::UserConProfileType, null: true

  def assumed_identity_from_profile
    context[:assumed_identity_from_profile]
  end

  field :account_form_content_html, String, null: true
  def account_form_content_html
    partial = CmsPartial.global.find_by(name: 'account_form_text')
    return nil unless partial
    context[:cadmus_renderer].render(Liquid::Template.parse(partial.content), :html)
  end

  field :user_con_profile, Types::UserConProfileType, null: true do
    argument :id, Integer, required: true
  end

  def user_con_profile(**args)
    convention.user_con_profiles.find(args[:id])
  end

  field :form, Types::FormType, null: true do
    argument :id, Integer, required: true
  end

  def form(**args)
    convention.forms.find(args[:id])
  end

  field :staff_position, Types::StaffPositionType, null: true do
    argument :id, Integer, required: true
  end

  def staff_position(id:)
    convention.staff_positions.find(id)
  end

  field :liquid_assigns, [Types::LiquidAssign], null: true

  def liquid_assigns
    LiquidAssignGraphqlPresenter.from_hash(context[:cadmus_renderer].default_assigns)
  end

  field :notifier_liquid_assigns, [Types::LiquidAssign], null: true do
    argument :event_key, String, required: true
  end

  def notifier_liquid_assigns(event_key:)
    notifier = NotifierPreviewFactory.new(convention: convention, event_key: event_key).notifier
    LiquidAssignGraphqlPresenter.from_hash(notifier.liquid_assigns)
  end

  field :preview_form_item, Types::FormItemType, null: false do
    argument :form_section_id, Int, required: true
    argument :form_item, Types::FormItemInputType, required: true
  end

  def preview_form_item(form_section_id:, form_item:)
    form_section = FormSection.find(form_section_id)
    FormItem.new(form_item.to_h.merge(id: 0, form_section: form_section))
  end

  field :preview_markdown, String, null: false do
    argument :markdown, String, required: true
  end

  def preview_markdown(markdown:)
    MarkdownPresenter.new('').render(markdown)
  end

  field :preview_liquid, String, null: false do
    argument :content, String, required: true

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

  field :preview_notifier_liquid, String, null: false do
    argument :event_key, String, required: true
    argument :content, String, required: true

    authorize do |_value, _args, context|
      Pundit.policy(context[:pundit_user], context[:convention]).view_reports?
    end
  end

  def preview_notifier_liquid(event_key:, content:)
    notifier = NotifierPreviewFactory.new(convention: convention, event_key: event_key).notifier
    notifier.cadmus_renderer.render(
      Liquid::Template.parse(content), :html, assigns: notifier.liquid_assigns
    )
  end

  field :product, Types::ProductType, null: false do
    argument :id, Integer, required: true
  end

  def product(id:)
    policy_scope(convention.products).find(id)
  end

  field :oauth_pre_auth, Types::JSON, null: false do
    argument :query_params, Types::JSON, required: true
  end

  def oauth_pre_auth(query_params:)
    pre_auth = Doorkeeper::OAuth::PreAuthorization.new(
      Doorkeeper.configuration,
      ActionController::Parameters.new(query_params)
    )
    pre_auth.valid?
    pre_auth.as_json({})
  end

  field :current_pending_order, Types::OrderType, null: true

  def current_pending_order
    context[:current_pending_order]
  end

  field :organizations, [Types::OrganizationType], null: false

  def organizations
    policy_scope(Organization.all)
  end

  field :root_site, Types::RootSiteType, null: false

  def root_site
    RootSite.instance
  end

  field :site_search, Types::SearchResultType, null: false do
    argument :query, String, required: true
  end

  def site_search(query:)
    SearchResult.convention_search(query, context[:convention]&.id, pundit_user)
  end

  field :signup, Types::SignupType, null: false do
    argument :id, Integer, required: true
  end

  def signup(**args)
    convention.signups.find(args[:id])
  end

  pagination_field :users_paginated, Types::UsersPaginationType, Types::UserFiltersInputType,
    camelize: false

  def users_paginated(**args)
    Tables::UsersTableResultsPresenter.new(
      policy_scope(User.all),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :user, Types::UserType, null: false do
    argument :id, Integer, required: true
  end

  def user(id:)
    User.find(id)
  end

  field :users, [Types::UserType], null: false do
    argument :ids, [Integer], required: true
  end

  def users(ids:)
    User.find(ids)
  end
end
