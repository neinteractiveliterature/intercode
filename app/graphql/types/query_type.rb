Types::QueryType = GraphQL::ObjectType.define do
  name 'Query'
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :convention, Types::ConventionType do
    argument :id, types.Int

    resolve ->(_obj, args, ctx) {
      if args[:id]
        Convention.find(args[:id])
      else
        ctx[:convention]
      end
    }
  end

  field :event, Types::EventType do
    argument :id, !types.Int

    resolve ->(_obj, args, ctx) {
      ctx[:convention].events.active.find(args[:id])
    }
  end

  field :events, types[Types::EventType] do
    argument :extendedCounts, types.Boolean
    argument :includeDropped, types.Boolean
    argument :start, Types::DateType
    argument :finish, Types::DateType

    guard ->(_obj, args, ctx) do
      current_ability = ctx[:current_ability]
      convention = ctx[:convention]
      if args[:includeDropped]
        return false unless current_ability.can?(:manage, Event.new(convention: convention))
      end

      true
    end

    resolve ->(_obj, args, ctx) {
      events = ctx[:convention].events
      events = events.active unless args['includeDropped']
      if args[:start] || args[:finish]
        run_scope = Run
        run_scope = run_scope.where('starts_at >= ?', args[:start]) if args[:start]
        run_scope = run_scope.where('starts_at < ?', args[:finish]) if args[:finish]
        events = events.where(id: run_scope.select(:event_id))
      end
      events
    }
  end

  field :eventProposal, Types::EventProposalType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].event_proposals.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) do
      ctx[:convention].event_proposals.find(args[:id])
    end
  end

  field :my_signups, Types::Signup.to_list_type do
    resolve ->(_obj, _args, ctx) {
      ctx[:user_con_profile].signups
    }
  end

  field :myProfile, Types::UserConProfileType do
    resolve ->(_obj, _args, ctx) {
      ctx[:user_con_profile]
    }
  end

  field :currentUser, Types::UserType do
    resolve ->(_obj, _args, ctx) {
      ctx[:current_user]
    }
  end

  field :cmsPages, types[!Types::PageType] do
    resolve ->(_obj, _args, ctx) {
      if ctx[:convention]
        ctx[:convention].pages
      else
        Page.global
      end
    }
  end

  field :cmsLayouts, Types::CmsLayoutType.to_non_null_type.to_list_type.to_non_null_type do
    resolve ->(_obj, _args, ctx) {
      if ctx[:convention]
        ctx[:convention].cms_layouts
      else
        CmsLayout.global
      end
    }
  end

  field :cmsVariables, types[Types::CmsVariable.to_non_null_type] do
    resolve ->(_obj, _args, ctx) {
      if ctx[:convention]
        ctx[:convention].cms_variables
      else
        CmsVariable.global
      end
    }
  end

  field :cmsGraphqlQueries, types[Types::CmsGraphqlQueryType.to_non_null_type] do
    resolve ->(_obj, _args, ctx) {
      if ctx[:convention]
        ctx[:convention].cms_graphql_queries
      else
        CmsGraphqlQuery.global
      end
    }
  end

  field :cmsNavigationItems, Types::CmsNavigationItemType.to_non_null_type.to_list_type.to_non_null_type do
    resolve ->(_obj, _args, ctx) {
      if ctx[:convention]
        ctx[:convention].cms_navigation_items
      else
        CmsNavigationItem.global
      end
    }
  end

  field :currentAbility, Types::AbilityType.to_non_null_type do
    resolve ->(_obj, _args, ctx) {
      ctx[:current_ability]
    }
  end

  field :assumedIdentityFromProfile, Types::UserConProfileType do
    resolve ->(_obj, _args, ctx) {
      ctx[:assumed_identity_from_profile]
    }
  end

  field :userConProfile, Types::UserConProfileType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].user_con_profiles.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].user_con_profiles.find(args[:id])
    }
  end

  field :form, Types::FormType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].forms.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].forms.find(args[:id])
    }
  end

  field :navigationBar, Types::NavigationBar.to_non_null_type do
    argument :cms_layout_id, types.Int

    resolve ->(_obj, args, ctx) do
      cms_layout = args[:cms_layout_id] ? CmsLayout.find(args[:cms_layout_id]) : nil

      NavigationBarPresenter.new(
        cms_layout&.navbar_classes || 'navbar-dark bg-intercode-blue',
        nil, # request
        ctx[:current_ability],
        ctx[:user_con_profile],
        !ctx[:current_user].nil?,
        ctx[:convention]
      ).navigation_bar
    end
  end

  field :staffPosition, Types::StaffPositionType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].staff_positions.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].staff_positions.find(args[:id])
    }
  end

  field :liquidAssigns, types[Types::LiquidAssign.to_non_null_type] do
    resolve ->(_obj, _args, ctx) do
      LiquidAssignGraphqlPresenter.from_hash(ctx[:cadmus_renderer].default_assigns)
    end
  end

  field :previewMarkdown, !types.String do
    argument :markdown, !types.String

    resolve ->(_obj, args, _ctx) do
      MarkdownPresenter.new('').render(args[:markdown])
    end
  end

  field :previewLiquid, !types.String do
    argument :content, !types.String

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

    resolve ->(_obj, args, ctx) do
      ctx[:cadmus_renderer].render(Liquid::Template.parse(args['content']), :html)
    end
  end

  field :product, !Types::ProductType do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].products.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].products.find(args[:id])
    }
  end

  field :currentPendingOrder, Types::OrderType do
    resolve ->(_obj, _args, ctx) {
      ctx[:current_pending_order]
    }
  end

  field :rootSite, Types::RootSiteType.to_non_null_type do
    resolve ->(_obj, _args, _ctx) {
      RootSite.instance
    }
  end

  field :signup, Types::Signup.to_non_null_type do
    argument :id, !types.Int

    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(:read, ctx[:convention].signups.find(args[:id]))
    end

    resolve ->(_obj, args, ctx) {
      ctx[:convention].signups.find(args[:id])
    }
  end

  field :users_paginated, Types::UsersPaginationType.to_non_null_type do
    argument :page, types.Int
    argument :per_page, types.Int
    argument :filters, Types::UserFiltersInputType
    argument :sort, types[Types::SortInputType]

    guard ->(_obj, _args, ctx) do
      ctx[:current_ability].can?(:read, User)
    end

    resolve ->(_obj, args, _ctx) do
      Tables::UsersTableResultsPresenter.new(
        User,
        args[:filters].to_h,
        args[:sort]
      ).paginate(page: args[:page], per_page: args[:per_page])
    end
  end
end
