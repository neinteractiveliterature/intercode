def guard_for_convention_associated_model(association, action)
  ->(_obj, args, ctx) {
    model = ctx[:convention].public_send(association).find(args[:id])
    ctx[:current_ability].can?(action, model)
  }
end

def guard_for_create_convention_associated_model(association)
  ->(_obj, args, ctx) {
    model = ctx[:convention].public_send(association).new
    ctx[:current_ability].can?(:create, model)
  }
end

def guard_for_create_event_associated_model(association, arg_name)
  guard ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])
    model = event.public_send(association).new(args[arg_name].to_h)
    ctx[:current_ability].can?(:create, model)
  }
end

def guard_for_model_with_id(model_class, action)
  guard ->(_obj, args, ctx) {
    ctx[:current_ability].can?(action, model_class.find(args[:id]))
  }
end

Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  ### CmsNavigationItems

  field :createCmsNavigationItem, Mutations::CreateCmsNavigationItem.field do
    guard(guard_for_create_convention_associated_model(:cms_navigation_items))
  end

  field :updateCmsNavigationItem, Mutations::UpdateCmsNavigationItem.field do
    guard(guard_for_convention_associated_model(:cms_navigation_items, :update))
  end

  field :deleteCmsNavigationItem, Mutations::DeleteCmsNavigationItem.field do
    guard(guard_for_convention_associated_model(:cms_navigation_items, :destroy))
  end

  field :sortCmsNavigationItems, Mutations::SortCmsNavigationItems.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(:sort, ctx[:convention].cms_navigation_items.new)
    }
  end

  ### Convention

  field :updateConvention, Mutations::UpdateConvention.field do
    guard ->(_obj, args, ctx) {
      convention = args[:id] ? Convention.find(args[:id]) : ctx[:convention]
      ctx[:current_ability].can?(:update, convention)
    }
  end

  ### Event

  field :createEvent, Mutations::CreateEvent.field do
    guard(guard_for_create_convention_associated_model(:events))
  end

  field :createFillerEvent, Mutations::CreateFillerEvent.field do
    guard(guard_for_create_convention_associated_model(:events))
  end

  field :dropEvent, Mutations::DropEvent.field do
    guard(guard_for_convention_associated_model(:events, :drop))
  end

  field :restoreDroppedEvent, Mutations::RestoreDroppedEvent.field do
    guard(guard_for_convention_associated_model(:events, :restore))
  end

  field :updateEvent, Mutations::UpdateEvent.field do
    guard(guard_for_convention_associated_model(:events, :update))
  end

  ### EventProposal

  field :updateEventProposal, Mutations::UpdateEventProposal.field do
    guard(guard_for_convention_associated_model(:event_proposals, :update))
  end

  field :submitEventProposal, Mutations::SubmitEventProposal.field do
    guard(guard_for_convention_associated_model(:event_proposals, :submit))
  end

  ### Form

  field :updateFormWithJSON, Mutations::UpdateFormWithJSON.field do
    guard(guard_for_model_with_id(Form, :update))
  end

  ### MaximumEventProvidedTicketsOverride

  create_override_field = Mutations::CreateMaximumEventProvidedTicketsOverride.field
  field :createMaximumEventProvidedTicketsOverride, create_override_field do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:create, event.maximum_event_provided_tickets_overrides.new)
    }
  end

  update_override_field = Mutations::UpdateMaximumEventProvidedTicketsOverride.field
  field :updateMaximumEventProvidedTicketsOverride, update_override_field do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :update))
  end

  delete_override_field = Mutations::DeleteMaximumEventProvidedTicketsOverride.field
  field :deleteMaximumEventProvidedTicketsOverride, delete_override_field do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :destroy))
  end

  ### Order / OrderEntry

  field :addOrderEntryToCurrentPendingOrder, Mutations::AddOrderEntryToCurrentPendingOrder.field do
    guard -> (_obj, _args, ctx) { ctx[:user_con_profile] }
  end

  field :updateOrderEntry, Mutations::UpdateOrderEntry.field do
    guard(guard_for_model_with_id(OrderEntry, :update))
  end

  field :deleteOrderEntry, Mutations::DeleteOrderEntry.field do
    guard(guard_for_model_with_id(OrderEntry, :destroy))
  end

  field :submitOrder, Mutations::SubmitOrder.field do
    guard(guard_for_model_with_id(Order, :submit))
  end

  field :markOrderPaid, Mutations::MarkOrderPaid.field do
    guard(guard_for_model_with_id(Order, :update))
  end

  field :updateOrder, Mutations::UpdateOrder.field do
    guard(guard_for_model_with_id(Order, :update))
  end

  field :cancelOrder, Mutations::CancelOrder.field do
    guard(guard_for_model_with_id(Order, :cancel))
  end

  ### Page

  field :deletePage, Mutations::DeletePage.field do
    guard(guard_for_convention_associated_model(:pages, :destroy))
  end

  ### Product

  field :createProduct, Mutations::CreateProduct.field do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:create, Product.new(convention: ctx[:convention]))
    }
  end

  field :updateProduct, Mutations::UpdateProduct.field do
    guard(guard_for_convention_associated_model(:products, :update))
  end

  field :deleteProduct, Mutations::DeleteProduct.field do
    guard(guard_for_convention_associated_model(:products, :destroy))
  end

  ### Room

  field :createRoom, Mutations::CreateRoom.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        Room.new({ convention: ctx[:convention] }.merge(args[:room].to_h))
      )
    }
  end

  field :updateRoom, Mutations::UpdateRoom.field do
    guard(guard_for_convention_associated_model(:rooms, :update))
  end

  field :deleteRoom, Mutations::DeleteRoom.field do
    guard(guard_for_convention_associated_model(:rooms, :destroy))
  end

  ### Run

  field :createRun, Mutations::CreateRun.field do
    guard(guard_for_create_event_associated_model(:runs, :run))
  end

  field :createMultipleRuns, Mutations::CreateMultipleRuns.field do
    guard ->(_obj, args, ctx) {
      events = ctx[:convention].events.find(args[:runs].map { |run| run[:event_id] })
      events.all? do |event|
        ctx[:current_ability].can?(:create, event.runs.new(args))
      end
    }
  end

  field :deleteRun, Mutations::DeleteRun.field do
    guard(guard_for_convention_associated_model(:runs, :destroy))
  end

  field :updateRun, Mutations::UpdateRun.field do
    guard(guard_for_convention_associated_model(:runs, :update))
  end

  ### StaffPosition

  field :createStaffPosition, Mutations::CreateStaffPosition.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        StaffPosition.new(args[:staff_position].to_h.merge(convention: ctx[:convention]))
      )
    }
  end

  field :updateStaffPosition, Mutations::UpdateStaffPosition.field do
    guard(guard_for_convention_associated_model(:staff_positions, :update))
  end

  field :deleteStaffPosition, Mutations::DeleteStaffPosition.field do
    guard(guard_for_convention_associated_model(:staff_positions, :destroy))
  end

  ### TeamMember

  field :createTeamMember, Mutations::CreateTeamMember.field do
    guard(guard_for_create_event_associated_model(:team_members, :team_member))
  end

  field :deleteTeamMember, Mutations::DeleteTeamMember.field do
    guard(guard_for_model_with_id(TeamMember, :destroy))
  end

  field :updateTeamMember, Mutations::UpdateTeamMember.field do
    guard(guard_for_model_with_id(TeamMember, :update))
  end

  ### Ticket

  field :purchaseTicket, Mutations::PurchaseTicket.field do
    guard -> (_obj, _args, ctx) do
      ctx[:user_con_profile]
    end
  end

  field :provideEventTicket, Mutations::ProvideEventTicket.field do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:update, event.team_members.new)
    }
  end

  ### TicketType

  field :createTicketType, Mutations::CreateTicketType.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        TicketType.new(args[:ticket_type].to_h.merge(convention: ctx[:convention]))
      )
    }
  end

  field :deleteTicketType, Mutations::DeleteTicketType.field do
    guard(guard_for_convention_associated_model(:ticket_types, :destroy))
  end

  field :updateTicketType, Mutations::UpdateTicketType.field do
    guard(guard_for_convention_associated_model(:ticket_types, :update))
  end

  ### UserConProfile

  field :updateUserConProfile, Mutations::UpdateUserConProfile.field do
    guard ->(_obj, args, ctx) {
      user_con_profile = ctx[:convention].user_con_profiles.find(args[:id])
      if args[:user_con_profile][:privileges]
        return false unless ctx[:current_ability].can?(:update_privileges, user_con_profile)
      end

      ctx[:current_ability].can?(:update, user_con_profile)
    }
  end
end
