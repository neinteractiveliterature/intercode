def guard_for_convention_associated_model(association, action)
  ->(_obj, args, ctx) {
    model = ctx[:convention].public_send(association).find(args[:id])
    ctx[:current_ability].can?(action, model)
  }
end

def guard_for_create_convention_associated_model(association)
  ->(_obj, _args, ctx) {
    model = ctx[:convention].public_send(association).new
    ctx[:current_ability].can?(:create, model)
  }
end

def guard_for_create_event_associated_model(association, arg_name)
  ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])
    model = event.public_send(association).new(args[arg_name].to_h)
    ctx[:current_ability].can?(:create, model)
  }
end

def guard_for_model_with_id(model_class, action)
  ->(_obj, args, ctx) {
    ctx[:current_ability].can?(action, model_class.find(args[:id]))
  }
end

class Types::MutationType < Types::BaseObject
  graphql_name 'Mutation'

  ### CmsNavigationItems

  field :createCmsNavigationItem, field: Mutations::CreateCmsNavigationItem.field do
    guard(guard_for_create_convention_associated_model(:cms_navigation_items))
  end

  field :updateCmsNavigationItem, field: Mutations::UpdateCmsNavigationItem.field do
    guard(guard_for_convention_associated_model(:cms_navigation_items, :update))
  end

  field :deleteCmsNavigationItem, field: Mutations::DeleteCmsNavigationItem.field do
    guard(guard_for_convention_associated_model(:cms_navigation_items, :destroy))
  end

  field :sortCmsNavigationItems, field: Mutations::SortCmsNavigationItems.field do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:sort, ctx[:convention].cms_navigation_items.new)
    }
  end

  ### Convention

  field :updateConvention, field: Mutations::UpdateConvention.field do
    guard ->(_obj, args, ctx) {
      convention = args[:id] ? Convention.find(args[:id]) : ctx[:convention]
      ctx[:current_ability].can?(:update, convention)
    }
  end

  ### Event

  field :createEvent, field: Mutations::CreateEvent.field do
    guard(guard_for_create_convention_associated_model(:events))
  end

  field :createFillerEvent, field: Mutations::CreateFillerEvent.field do
    guard(guard_for_create_convention_associated_model(:events))
  end

  field :dropEvent, field: Mutations::DropEvent.field do
    guard(guard_for_convention_associated_model(:events, :drop))
  end

  field :restoreDroppedEvent, field: Mutations::RestoreDroppedEvent.field do
    guard(guard_for_convention_associated_model(:events, :restore))
  end

  field :updateEvent, field: Mutations::UpdateEvent.field do
    guard(guard_for_convention_associated_model(:events, :update))
  end

  ### EventProposal

  field :createEventProposal, mutation: Mutations::CreateEventProposal do
    guard(guard_for_create_convention_associated_model(:event_proposals))
  end

  field :updateEventProposal, field: Mutations::UpdateEventProposal.field do
    guard(guard_for_convention_associated_model(:event_proposals, :update))
  end

  field :submitEventProposal, field: Mutations::SubmitEventProposal.field do
    guard(guard_for_convention_associated_model(:event_proposals, :submit))
  end

  ### Form

  field :updateFormWithJSON, field: Mutations::UpdateFormWithJSON.field do
    guard(guard_for_model_with_id(Form, :update))
  end

  ### MaximumEventProvidedTicketsOverride

  create_override_field = Mutations::CreateMaximumEventProvidedTicketsOverride.field
  field :createMaximumEventProvidedTicketsOverride, field: create_override_field do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:create, event.maximum_event_provided_tickets_overrides.new)
    }
  end

  update_override_field = Mutations::UpdateMaximumEventProvidedTicketsOverride.field
  field :updateMaximumEventProvidedTicketsOverride, field: update_override_field do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :update))
  end

  delete_override_field = Mutations::DeleteMaximumEventProvidedTicketsOverride.field
  field :deleteMaximumEventProvidedTicketsOverride, field: delete_override_field do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :destroy))
  end

  ### Order / OrderEntry

  field :addOrderEntryToCurrentPendingOrder, field: Mutations::AddOrderEntryToCurrentPendingOrder.field do
    guard -> (_obj, _args, ctx) { ctx[:user_con_profile] }
  end

  field :updateOrderEntry, field: Mutations::UpdateOrderEntry.field do
    guard(guard_for_model_with_id(OrderEntry, :update))
  end

  field :deleteOrderEntry, field: Mutations::DeleteOrderEntry.field do
    guard(guard_for_model_with_id(OrderEntry, :destroy))
  end

  field :submitOrder, field: Mutations::SubmitOrder.field do
    guard(guard_for_model_with_id(Order, :submit))
  end

  field :markOrderPaid, field: Mutations::MarkOrderPaid.field do
    guard(guard_for_model_with_id(Order, :update))
  end

  field :updateOrder, field: Mutations::UpdateOrder.field do
    guard(guard_for_model_with_id(Order, :update))
  end

  field :cancelOrder, field: Mutations::CancelOrder.field do
    guard(guard_for_model_with_id(Order, :cancel))
  end

  ### Page

  field :deletePage, field: Mutations::DeletePage.field do
    guard(guard_for_convention_associated_model(:pages, :destroy))
  end

  ### Product

  field :createProduct, field: Mutations::CreateProduct.field do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:create, Product.new(convention: ctx[:convention]))
    }
  end

  field :updateProduct, field: Mutations::UpdateProduct.field do
    guard(guard_for_convention_associated_model(:products, :update))
  end

  field :deleteProduct, field: Mutations::DeleteProduct.field do
    guard(guard_for_convention_associated_model(:products, :destroy))
  end

  ### Room

  field :createRoom, field: Mutations::CreateRoom.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        Room.new({ convention: ctx[:convention] }.merge(args[:room].to_h))
      )
    }
  end

  field :updateRoom, field: Mutations::UpdateRoom.field do
    guard(guard_for_convention_associated_model(:rooms, :update))
  end

  field :deleteRoom, field: Mutations::DeleteRoom.field do
    guard(guard_for_convention_associated_model(:rooms, :destroy))
  end

  ### Run

  field :createRun, field: Mutations::CreateRun.field do
    guard(guard_for_create_event_associated_model(:runs, :run))
  end

  field :createMultipleRuns, field: Mutations::CreateMultipleRuns.field do
    guard ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      args.to_h['runs'].all? do |run_args|
        ctx[:current_ability].can?(:create, event.runs.new(run_args))
      end
    }
  end

  field :deleteRun, field: Mutations::DeleteRun.field do
    guard(guard_for_convention_associated_model(:runs, :destroy))
  end

  field :updateRun, field: Mutations::UpdateRun.field do
    guard(guard_for_convention_associated_model(:runs, :update))
  end

  ### Signup

  field :withdrawAllUserConProfileSignups, mutation: Mutations::WithdrawAllUserConProfileSignups do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :update,
        Signup.new(
          user_con_profile: ctx[:convention].user_con_profiles.find(args[:user_con_profile_id]),
          run: Run.new(event: Event.new(convention: ctx[:convention]))
        )
      )
    }
  end

  field :forceConfirmSignup, field: Mutations::ForceConfirmSignup.field do
    guard(guard_for_convention_associated_model(:signups, :update))
  end

  field :updateSignupBucket, field: Mutations::UpdateSignupBucket.field do
    guard(guard_for_convention_associated_model(:signups, :update_bucket))
  end

  field :updateSignupCounted, field: Mutations::UpdateSignupCounted.field do
    guard(guard_for_convention_associated_model(:signups, :update))
  end

  ### StaffPosition

  field :createStaffPosition, field: Mutations::CreateStaffPosition.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        StaffPosition.new(args[:staff_position].to_h.merge(convention: ctx[:convention]))
      )
    }
  end

  field :updateStaffPosition, field: Mutations::UpdateStaffPosition.field do
    guard(guard_for_convention_associated_model(:staff_positions, :update))
  end

  field :deleteStaffPosition, field: Mutations::DeleteStaffPosition.field do
    guard(guard_for_convention_associated_model(:staff_positions, :destroy))
  end

  ### TeamMember

  field :createTeamMember, field: Mutations::CreateTeamMember.field do
    guard(guard_for_create_event_associated_model(:team_members, :team_member))
  end

  field :deleteTeamMember, field: Mutations::DeleteTeamMember.field do
    guard(guard_for_model_with_id(TeamMember, :destroy))
  end

  field :updateTeamMember, field: Mutations::UpdateTeamMember.field do
    guard(guard_for_model_with_id(TeamMember, :update))
  end

  ### Ticket

  field :deleteTicket, field: Mutations::DeleteTicket.field do
    guard(guard_for_model_with_id(Ticket, :destroy))
  end

  field :purchaseTicket, field: Mutations::PurchaseTicket.field do
    guard -> (_obj, _args, ctx) do
      ctx[:user_con_profile]
    end
  end

  field :provideEventTicket, field: Mutations::ProvideEventTicket.field do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:update, event.team_members.new)
    }
  end

  ### TicketType

  field :createTicketType, field: Mutations::CreateTicketType.field do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        TicketType.new(args[:ticket_type].to_h.merge(convention: ctx[:convention]))
      )
    }
  end

  field :deleteTicketType, field: Mutations::DeleteTicketType.field do
    guard(guard_for_convention_associated_model(:ticket_types, :destroy))
  end

  field :updateTicketType, field: Mutations::UpdateTicketType.field do
    guard(guard_for_convention_associated_model(:ticket_types, :update))
  end

  ### UserConProfile

  field :createUserConProfile, field: Mutations::CreateUserConProfile.field do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:create, UserConProfile.new(convention: ctx[:convention]))
    }
  end

  field :updateUserConProfile, field: Mutations::UpdateUserConProfile.field do
    guard ->(_obj, args, ctx) {
      user_con_profile = ctx[:convention].user_con_profiles.find(args[:id])
      if args[:user_con_profile][:privileges]
        return false unless ctx[:current_ability].can?(:update_privileges, user_con_profile)
      end

      ctx[:current_ability].can?(:update, user_con_profile)
    }
  end

  field :deleteUserConProfile, field: Mutations::DeleteUserConProfile.field do
    guard(guard_for_model_with_id(UserConProfile, :destroy))
  end
end
