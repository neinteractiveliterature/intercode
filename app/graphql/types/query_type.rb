class Types::QueryType < Types::BaseObject
  field_class GraphQL::Schema::Field # Camelize fields in this type

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

  field :event, Types::EventType, null: true do
    argument :id, Integer, required: true
  end

  def event(**args)
    context[:convention].events.active.find(args[:id])
  end

  field :events, [Types::EventType, null: true], null: true do
    argument :extended_counts, Boolean, required: false
    argument :include_dropped, Boolean, required: false
    argument :start, Types::DateType, required: false
    argument :finish, Types::DateType, required: false

    guard ->(_obj, args, ctx) do
      current_ability = ctx[:current_ability]
      convention = ctx[:convention]
      if args[:includeDropped]
        return false unless current_ability.can?(:manage, Event.new(convention: convention))
      end

      true
    end
  end

  def events(include_dropped: false, start: nil, finish: nil, **args)
    events = convention.events
    events = events.active unless include_dropped
    if start || finish
      run_scope = Run
      run_scope = run_scope.where('starts_at >= ?', start) if start
      run_scope = run_scope.where('starts_at < ?', finish) if finish
      events = events.where(id: run_scope.select(:event_id))
    end
    events
  end

  field :event_proposal, Types::EventProposalType, null: true do
    argument :id, Integer, required: true

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].event_proposals.find(args[:id]))
    end
  end

  def event_proposal(**args)
    convention.event_proposals.find(args[:id])
  end

  field :my_signups, [Types::SignupType], null: true, camelize: false

  def my_signups
    context[:user_con_profile].signups
  end

  field :my_profile, Types::UserConProfileType, null: true

  def my_profile
    context[:user_con_profile]
  end

  field :current_user, Types::UserType, null: true

  def current_user
    context[:current_user]
  end

  field :cms_parent, Types::CmsParentType, null: false

  def cms_parent
    convention || root_site
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

  def current_ability
    context[:current_ability]
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

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].user_con_profiles.find(args[:id]))
    end
  end

  def user_con_profile(**args)
    convention.user_con_profiles.find(args[:id])
  end

  field :form, Types::FormType, null: true do
    argument :id, Integer, required: true

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].forms.find(args[:id]))
    end
  end

  def form(**args)
    convention.forms.find(args[:id])
  end

  field :navigation_bar, Types::NavigationBarType, null: false do
    argument :cms_layout_id, Integer, required: false, camelize: false
  end

  def navigation_bar(**args)
    cms_layout = if args[:cms_layout_id]
      CmsLayout.find(args[:cms_layout_id])
    else
      cms_parent.default_layout
    end

    NavigationBarPresenter.new(
      cms_layout&.navbar_classes || ApplicationHelper::DEFAULT_NAVBAR_CLASSES,
      nil, # request
      context[:current_ability],
      context[:user_con_profile],
      !context[:current_user].nil?,
      context[:convention]
    ).navigation_bar
  end

  field :staff_position, Types::StaffPositionType, null: true do
    argument :id, Integer, required: true

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].staff_positions.find(args[:id]))
    end
  end

  def staff_position(**args)
    convention.staff_positions.find(args[:id])
  end

  field :liquid_assigns, [Types::LiquidAssign], null: true

  def liquid_assigns
    LiquidAssignGraphqlPresenter.from_hash(context[:cadmus_renderer].default_assigns)
  end

  field :preview_markdown, String, null: false do
    argument :markdown, String, required: true
  end

  def preview_markdown(markdown:)
    MarkdownPresenter.new('').render(markdown)
  end

  field :preview_liquid, String, null: false do
    argument :content, String, required: true

    guard ->(_obj, _args, ctx) do
      # TODO maybe better permission for this?  Not sure, but for now I'm using con_com as a proxy
      # for "privileged enough to preview arbitrary Liquid (and therefore access arbitrary Liquid
      # drop data)"
      if ctx[:convention]
        ctx[:current_ability].can?(:view_reports, ctx[:convention])
      else
        ctx[:current_user].site_admin?
      end
    end
  end

  def preview_liquid(content:)
    cadmus_renderer.render(Liquid::Template.parse(content), :html)
  end

  field :product, Types::ProductType, null: false do
    argument :id, Integer, required: true

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].products.find(args[:id]))
    end
  end

  def product(**args)
    convention.products.find(args[:id])
  end

  field :current_pending_order, Types::OrderType, null: true

  def current_pending_order
    context[:current_pending_order]
  end

  field :organizations, [Types::OrganizationType], null: false

  def organizations
    Organization.all
  end

  field :root_site, Types::RootSiteType, null: false

  def root_site
    RootSite.instance
  end

  field :signup, Types::SignupType, null: false do
    argument :id, Integer, required: true

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].signups.find(args[:id]))
    end
  end

  def signup(**args)
    convention.signups.find(args[:id])
  end

  pagination_field :users_paginated, Types::UsersPaginationType, Types::UserFiltersInputType, camelize: false do
    guard ->(_obj, _args, ctx) do
      ctx[:current_ability].can?(:read, User)
    end
  end

  def users_paginated(**args)
    Tables::UsersTableResultsPresenter.new(
      User.accessible_by(current_ability),
      args[:filters].to_h,
      args[:sort]
    ).paginate(page: args[:page], per_page: args[:per_page])
  end

  field :user, Types::UserType, null: false do
    argument :id, Integer, required: true

    guard ->(_obj, args, ctx) do
      args[:id] == ctx[:current_user]&.id || ctx[:current_ability].can?(:read, User)
    end
  end

  def user(id:)
    User.find(id)
  end

  field :users, [Types::UserType], null: false do
    argument :ids, [Integer], required: true

    guard ->(_obj, _args, ctx) do
      ctx[:current_ability].can?(:read, User)
    end
  end

  def users(ids:)
    User.find(ids)
  end
end
