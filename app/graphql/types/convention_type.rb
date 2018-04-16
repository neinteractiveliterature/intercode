class Types::ConventionType < Types::BaseObject
  field :accepting_proposals, Boolean, null: true
  field :created_at, Types::DateType, null: true
  field :updated_at, Types::DateType, null: true
  field :starts_at, Types::DateType, null: true
  field :ends_at, Types::DateType, null: true
  field :name, String, null: true
  field :domain, String, null: true
  field :timezone_name, String, null: true
  field :show_schedule, Types::ShowScheduleType, null: true
  field :maximum_tickets, Integer, null: true
  field :maximum_event_signups, Types::ScheduledValueType, null: true
  field :ticket_name, String, null: false
  field :user_con_profile_form, Types::FormType, null: false
  field :event_proposal_form, Types::FormType, null: false
  field :regular_event_form, Types::FormType, null: false
  field :volunteer_event_form, Types::FormType, null: false
  field :filler_event_form, Types::FormType, null: false

  field :cms_layouts, [Types::CmsLayoutType, null: true], null: true

  def cms_layouts
    AssociationLoader.for(Convention, :cms_layouts).load(@object)
  end

  field :default_layout, Types::CmsLayoutType, null: true

  def default_layout
    AssociationLoader.for(Convention, :default_layout).load(@object)
  end

  field :pages, [Types::PageType, null: true], null: true

  def pages
    AssociationLoader.for(Convention, :pages).load(@object)
  end

  field :rooms, [Types::RoomType, null: true], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, Room.new(convention: convention))
    end
  end

  def rooms
    AssociationLoader.for(Convention, :rooms).load(@object)
  end

  field :root_page, Types::PageType, null: true

  def root_page
    AssociationLoader.for(Convention, :root_page).load(@object)
  end

  field :staff_positions, [Types::StaffPositionType, null: true], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, StaffPosition.new(convention: convention))
    end
  end

  def staff_positions
    AssociationLoader.for(Convention, :staff_positions).load(@object)
  end

  field :ticket_types, [Types::TicketTypeType, null: true], null: true do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, TicketType.new(convention: convention))
    end
  end

  def ticket_types
    AssociationLoader.for(Convention, :ticket_types).load(@object)
  end

  field :products, [Types::ProductType, null: true], null: true

  def products
    AssociationLoader.for(Convention, :products).load(@object)
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
    @object.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])
  end

  field :orders_paginated, Types::OrdersPaginationType, null: false do
    argument :page, Integer, required: false
    argument :per_page, Integer, required: false
    argument :filters, Types::OrderFiltersInputType, required: false
    argument :sort, [Types::SortInputType, null: true], required: false

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Order.new(user_con_profile: UserConProfile.new(convention: convention))
      )
    end
  end

  def orders_paginated(**args)
    scope = @object.orders.where.not(status: 'pending')
      .includes(order_entries: [:product, :product_variant])

    Tables::OrdersTableResultsPresenter.new(scope, args[:filters].to_h, args[:sort])
      .scoped
      .paginate(page: args[:page] || 1, per_page: args[:per_page] || 20)
  end

  field :user_con_profiles, Types::UserConProfileType.connection_type, max_page_size: 1000, null: true, connection: true do
    argument :name, String, required: false

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserConProfile.new(convention: convention))
    end
  end

  def user_con_profiles(**args)
    grid_args = args.to_h.symbolize_keys.except(:first, :last, :after, :before)
    grid = UserConProfilesGrid.new(grid_args)
    grid.assets.accessible_by(@context[:current_ability]).where(convention_id: @object.id)
  end
end
