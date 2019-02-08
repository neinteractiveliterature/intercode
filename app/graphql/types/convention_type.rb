Types::ConventionType = GraphQL::ObjectType.define do
  name 'Convention'
  field :id, !types.Int
  field :accepting_proposals, types.Boolean
  field :created_at, Types::DateType
  field :updated_at, Types::DateType
  field :starts_at, Types::DateType
  field :ends_at, Types::DateType
  field :name, types.String
  field :domain, types.String
  field :event_mailing_list_domain, types.String
  field :timezone_name, types.String
  field :show_schedule, Types::ShowScheduleType
  field :show_event_list, Types::ShowScheduleType
  field :maximum_tickets, types.Int
  field :maximum_event_signups, Types::ScheduledValueType
  field :ticket_name, !types.String
  field :user_con_profile_form, Types::FormType.to_non_null_type
  field :clickwrap_agreement, types.String

  field :stripe_publishable_key, types.String
  field :masked_stripe_secret_key, types.String do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:update, convention)
    end
  end

  field :event_categories, Types::EventCategoryType.to_list_type.to_non_null_type do
    argument :current_ability_can_read_event_proposals, types.Boolean

    resolve -> (convention, args, ctx) do
      promise = AssociationLoader.for(Convention, :event_categories).load(convention)

      if args[:current_ability_can_read_event_proposals]
        promise.then do |event_categories|
          event_categories.select do |category|
            ctx[:current_ability].can?(:read, EventProposal.new(event_category: category, status: 'proposed'))
          end
        end
      else
        AssociationLoader.for(Convention, :event_categories).load(convention)
      end
    end
  end

  field :forms, Types::FormType.to_list_type.to_non_null_type do
    resolve -> (convention, _args, _ctx) do
      AssociationLoader.for(Convention, :forms).load(convention)
    end
  end

  field :privilege_names, !types[!types.String] do
    resolve -> (_convention, _args, _ctx) do
      ['site_admin'] + UserConProfile::PRIV_NAMES.to_a
    end
  end

  field :mail_privilege_names, !types[!types.String] do
    resolve -> (_convention, _args, _ctx) do
      UserConProfile::MAIL_PRIV_NAMES
    end
  end

  field :cms_layouts, types[Types::CmsLayoutType] do
    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :cms_layouts).load(convention)
    }
  end

  field :default_layout, Types::CmsLayoutType do
    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :default_layout).load(convention)
    }
  end

  field :cms_navigation_items, types[Types::CmsNavigationItemType] do
    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :cms_navigation_items).load(convention)
    }
  end

  field :pages, types[Types::PageType] do
    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :pages).load(convention)
    }
  end

  field :rooms, types[Types::RoomType] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, Room.new(convention: convention))
    end

    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :rooms).load(convention)
    }
  end

  field :root_page, Types::PageType do
    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :root_page).load(convention)
    }
  end

  field :staff_positions, types[Types::StaffPositionType] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, StaffPosition.new(convention: convention))
    end

    resolve ->(convention, _args, _ctx) {
      AssociationLoader.for(Convention, :staff_positions).load(convention)
    }
  end

  field :ticket_types, types[Types::TicketTypeType] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, TicketType.new(convention: convention))
    end

    resolve ->(convention, _args, _ctx) {
      AssociationLoader.for(Convention, :ticket_types).load(convention)
    }
  end

  field :products, types[Types::ProductType] do
    resolve ->(convention, _args, _ctx) do
      AssociationLoader.for(Convention, :products).load(convention)
    end
  end

  field :user_activity_alert, Types::UserActivityAlert.to_non_null_type do
    argument :id, !types.Int

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserActivityAlert.new(convention: convention))
    end

    resolve ->(convention, args, _ctx) {
      RecordLoader.for(UserActivityAlert, where: { convention_id: convention.id }).load(args[:id])
    }
  end

  field :user_activity_alerts, types[Types::UserActivityAlert] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserActivityAlert.new(convention: convention))
    end

    resolve ->(convention, _args, _ctx) {
      AssociationLoader.for(Convention, :user_activity_alerts).load(convention)
    }
  end

  connection :orders, Types::OrdersConnectionType, max_page_size: 1000 do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Order.new(user_con_profile: UserConProfile.new(convention: convention))
      )
    end

    resolve ->(convention, _args, _ctx) do
      convention.orders.where.not(status: 'pending')
        .includes(order_entries: [:product, :product_variant])
    end
  end

  field :event_proposals_paginated, Types::EventProposalsPaginationType.to_non_null_type do
    argument :page, types.Int
    argument :per_page, types.Int
    argument :filters, Types::EventProposalFiltersInputType
    argument :sort, types[Types::SortInputType]

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:view_event_proposals, convention)
    end

    resolve ->(convention, args, ctx) do
      Tables::EventProposalsTableResultsPresenter.for_convention(
        convention,
        ctx[:current_ability],
        args[:filters].to_h,
        args[:sort]
      ).paginate(page: args[:page], per_page: args[:per_page])
    end
  end

  field :events_paginated, Types::EventsPaginationType.to_non_null_type do
    argument :page, types.Int
    argument :per_page, types.Int
    argument :filters, Types::EventFiltersInputType
    argument :sort, types[Types::SortInputType]

    resolve ->(convention, args, ctx) do
      Tables::EventsTableResultsPresenter.for_convention(
        convention: convention,
        ability: ctx[:current_ability],
        filters: args[:filters].to_h,
        sort: args[:sort]
      ).paginate(page: args[:page], per_page: args[:per_page])
    end
  end

  field :orders_paginated, Types::OrdersPaginationType.to_non_null_type do
    argument :page, types.Int
    argument :per_page, types.Int
    argument :filters, Types::OrderFiltersInputType
    argument :sort, types[Types::SortInputType]

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Order.new(user_con_profile: UserConProfile.new(convention: convention))
      )
    end

    resolve ->(convention, args, _ctx) do
      scope = convention.orders.where.not(status: 'pending')
        .includes(order_entries: [:product, :product_variant])

      Tables::OrdersTableResultsPresenter.new(scope, args[:filters].to_h, args[:sort])
        .paginate(page: args[:page], per_page: args[:per_page])
    end
  end

  field :signup_spy_paginated, Types::SignupsPaginationType.to_non_null_type do
    argument :page, types.Int
    argument :per_page, types.Int
    argument :filters, Types::UserConProfileFiltersInputType
    argument :sort, types[Types::SortInputType]

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:view_reports, convention)
    end

    resolve ->(convention, args, _ctx) do
      Tables::SignupsTableResultsPresenter.signup_spy_for_convention(convention)
        .paginate(page: args[:page], per_page: args[:per_page])
    end
  end

  field :user_con_profiles_paginated, Types::UserConProfilesPaginationType.to_non_null_type do
    argument :page, types.Int
    argument :per_page, types.Int
    argument :filters, Types::UserConProfileFiltersInputType
    argument :sort, types[Types::SortInputType]

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserConProfile.new(convention: convention))
    end

    resolve ->(convention, args, ctx) do
      Tables::UserConProfilesTableResultsPresenter.for_convention(
        convention,
        ctx[:current_ability],
        args[:filters].to_h,
        args[:sort]
      ).paginate(page: args[:page], per_page: args[:per_page])
    end
  end
end
