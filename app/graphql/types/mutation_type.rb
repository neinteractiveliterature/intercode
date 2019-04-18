def guard_for_cms_model(model_class, action, find_by: :id)
  ->(_obj, args, ctx) {
    model = if ctx[:convention]
      model_class.find_by(parent_type: 'Convention', parent_id: ctx[:convention].id, find_by => args[find_by])
    else
      model_class.global.find_by(find_by => args[find_by])
    end
    ctx[:current_ability].can?(action, model)
  }
end

def guard_for_create_cms_model(model_class)
  ->(_obj, args, ctx) {
    model = model_class.new(parent: ctx[:convention])
    ctx[:current_ability].can?(:create, model)
  }
end

def guard_for_convention_associated_model(association, action, find_by: :id)
  ->(_obj, args, ctx) {
    model = ctx[:convention].public_send(association).find_by(find_by => args[find_by])
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

def guard_for_model_with_id(model_class, action, find_by: :id)
  ->(_obj, args, ctx) {
    ctx[:current_ability].can?(action, model_class.find_by(find_by => args[find_by]))
  }
end

class Types::MutationType < Types::BaseObject
  graphql_name 'Mutation'

  # CSRF verification, but only for mutations
  guard do |_obj, _args, ctx|
    raise ActionController::InvalidAuthenticityToken unless ctx[:verified_request]
  end

  ### CmsGraphqlQuery

  field :createCmsGraphqlQuery, mutation: Mutations::CreateCmsGraphqlQuery do
    guard(guard_for_create_cms_model(CmsGraphqlQuery))
  end

  field :updateCmsGraphqlQuery, mutation: Mutations::UpdateCmsGraphqlQuery do
    guard(guard_for_cms_model(CmsGraphqlQuery, :update))
  end

  field :deleteCmsGraphqlQuery, mutation: Mutations::DeleteCmsGraphqlQuery do
    guard(guard_for_cms_model(CmsGraphqlQuery, :destroy))
  end

  ### CmsNavigationItem

  field :createCmsNavigationItem, mutation: Mutations::CreateCmsNavigationItem do
    guard(guard_for_create_cms_model(CmsNavigationItem))
  end

  field :updateCmsNavigationItem, mutation: Mutations::UpdateCmsNavigationItem do
    guard(guard_for_cms_model(CmsNavigationItem, :update))
  end

  field :deleteCmsNavigationItem, mutation: Mutations::DeleteCmsNavigationItem do
    guard(guard_for_cms_model(CmsNavigationItem, :destroy))
  end

  field :sortCmsNavigationItems, mutation: Mutations::SortCmsNavigationItems do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:sort, CmsNavigationItem.new(parent: ctx[:convention]))
    }
  end

  ### CmsVariable

  field :setCmsVariable, mutation: Mutations::SetCmsVariable do
    guard(guard_for_create_cms_model(::CmsVariable))
  end

  field :deleteCmsVariable, mutation: Mutations::DeleteCmsVariable do
    guard(guard_for_cms_model(::CmsVariable, :destroy, find_by: :key))
  end

  ### Convention

  field :updateConvention, mutation: Mutations::UpdateConvention do
    guard ->(_obj, args, ctx) {
      convention = args[:id] ? Convention.find(args[:id]) : ctx[:convention]
      ctx[:current_ability].can?(:update, convention)
    }
  end

  ### Event

  field :createEvent, mutation: Mutations::CreateEvent do
    guard(guard_for_create_convention_associated_model(:events))
  end

  field :createFillerEvent, mutation: Mutations::CreateFillerEvent do
    guard(guard_for_create_convention_associated_model(:events))
  end

  field :dropEvent, mutation: Mutations::DropEvent do
    guard(guard_for_convention_associated_model(:events, :drop))
  end

  field :restoreDroppedEvent, mutation: Mutations::RestoreDroppedEvent do
    guard(guard_for_convention_associated_model(:events, :restore))
  end

  field :updateEvent, mutation: Mutations::UpdateEvent do
    guard(guard_for_convention_associated_model(:events, :update))
  end

  field :updateEventAdminNotes, mutation: Mutations::UpdateEventAdminNotes do
    guard(guard_for_convention_associated_model(:events, :update_admin_notes))
  end

  ### EventCategory

  field :createEventCategory, mutation: Mutations::CreateEventCategory do
    guard(guard_for_create_convention_associated_model(:event_categories))
  end

  field :updateEventCategory, mutation: Mutations::UpdateEventCategory do
    guard(guard_for_convention_associated_model(:event_categories, :update))
  end


  field :deleteEventCategory, mutation: Mutations::DeleteEventCategory do
    guard(guard_for_convention_associated_model(:event_categories, :destroy))
  end

  ### EventProposal

  field :createEventProposal, mutation: Mutations::CreateEventProposal do
    guard(guard_for_create_convention_associated_model(:event_proposals))
  end

  field :updateEventProposal, mutation: Mutations::UpdateEventProposal do
    guard(guard_for_convention_associated_model(:event_proposals, :update))
  end

  field :submitEventProposal, mutation: Mutations::SubmitEventProposal do
    guard(guard_for_convention_associated_model(:event_proposals, :submit))
  end

  field :transitionEventProposal, mutation: Mutations::TransitionEventProposal do
    guard -> (_obj, args, ctx) {
      event_proposal = ctx[:convention].event_proposals.find(args[:id])
      (
        ctx[:current_ability].can?(:update, event_proposal) &&
        (!args[:drop_event] || ctx[:current_ability].can?(:drop, event_proposal.event))
      )
    }
  end

  field :updateEventProposalAdminNotes, mutation: Mutations::UpdateEventProposalAdminNotes do
    guard(guard_for_convention_associated_model(:event_proposals, :update_admin_notes))
  end

  ### Form

  field :createFormWithJSON, mutation: Mutations::CreateFormWithJSON do
    guard(guard_for_create_convention_associated_model(:forms))
  end

  field :updateFormWithJSON, mutation: Mutations::UpdateFormWithJSON do
    guard(guard_for_convention_associated_model(:forms, :update))
  end

  field :deleteForm, mutation: Mutations::DeleteForm do
    guard(guard_for_convention_associated_model(:forms, :destroy))
  end

  ### MaximumEventProvidedTicketsOverride

  create_override = Mutations::CreateMaximumEventProvidedTicketsOverride
  field :createMaximumEventProvidedTicketsOverride, mutation: create_override do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:create, event.maximum_event_provided_tickets_overrides.new)
    }
  end

  update_override = Mutations::UpdateMaximumEventProvidedTicketsOverride
  field :updateMaximumEventProvidedTicketsOverride, mutation: update_override do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :update))
  end

  delete_override = Mutations::DeleteMaximumEventProvidedTicketsOverride
  field :deleteMaximumEventProvidedTicketsOverride, mutation: delete_override do
    guard(guard_for_model_with_id(MaximumEventProvidedTicketsOverride, :destroy))
  end

  ### Order / OrderEntry

  field :addOrderEntryToCurrentPendingOrder, mutation: Mutations::AddOrderEntryToCurrentPendingOrder do
    guard -> (_obj, _args, ctx) { ctx[:user_con_profile] }
  end

  field :updateOrderEntry, mutation: Mutations::UpdateOrderEntry do
    guard(guard_for_model_with_id(OrderEntry, :update))
  end

  field :deleteOrderEntry, mutation: Mutations::DeleteOrderEntry do
    guard(guard_for_model_with_id(OrderEntry, :destroy))
  end

  field :submitOrder, mutation: Mutations::SubmitOrder do
    guard(guard_for_model_with_id(Order, :submit))
  end

  field :markOrderPaid, mutation: Mutations::MarkOrderPaid do
    guard(guard_for_model_with_id(Order, :update))
  end

  field :updateOrder, mutation: Mutations::UpdateOrder do
    guard(guard_for_model_with_id(Order, :update))
  end

  field :cancelOrder, mutation: Mutations::CancelOrder do
    guard(guard_for_model_with_id(Order, :cancel))
  end

  ### OrganizationRole

  field :createOrganizationRole, mutation: Mutations::CreateOrganizationRole do
    guard ->(_obj, args, ctx) {
      organization = Organization.find(args[:organization_id])
      ctx[:current_ability].can?(:create, OrganizationRole.new(organization: organization))
    }
  end

  field :updateOrganizationRole, mutation: Mutations::UpdateOrganizationRole do
    guard(guard_for_model_with_id(OrganizationRole, :update))
  end

  field :deleteOrganizationRole, mutation: Mutations::DeleteOrganizationRole do
    guard(guard_for_model_with_id(OrganizationRole, :destroy))
  end

  ### Page

  field :deletePage, mutation: Mutations::DeletePage do
    guard(guard_for_cms_model(Page, :destroy))
  end

  ### Product

  field :createProduct, mutation: Mutations::CreateProduct do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:create, Product.new(convention: ctx[:convention]))
    }
  end

  field :updateProduct, mutation: Mutations::UpdateProduct do
    guard(guard_for_convention_associated_model(:products, :update))
  end

  field :deleteProduct, mutation: Mutations::DeleteProduct do
    guard(guard_for_convention_associated_model(:products, :destroy))
  end

  ### Room

  field :createRoom, mutation: Mutations::CreateRoom do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        Room.new({ convention: ctx[:convention] }.merge(args[:room].to_h))
      )
    }
  end

  field :updateRoom, mutation: Mutations::UpdateRoom do
    guard(guard_for_convention_associated_model(:rooms, :update))
  end

  field :deleteRoom, mutation: Mutations::DeleteRoom do
    guard(guard_for_convention_associated_model(:rooms, :destroy))
  end

  ### RootSite

  field :updateRootSite, mutation: Mutations::UpdateRootSite do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:update, RootSite)
    }
  end

  ### Run

  field :createRun, mutation: Mutations::CreateRun do
    guard(guard_for_create_event_associated_model(:runs, :run))
  end

  field :createMultipleRuns, mutation: Mutations::CreateMultipleRuns do
    guard ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      args[:runs].all? do |run_args|
        ctx[:current_ability].can?(:create, event.runs.new(run_args.to_h))
      end
    }
  end

  field :deleteRun, mutation: Mutations::DeleteRun do
    guard(guard_for_convention_associated_model(:runs, :destroy))
  end

  field :updateRun, mutation: Mutations::UpdateRun do
    guard(guard_for_convention_associated_model(:runs, :update))
  end

  ### Signup

  field :createMySignup, mutation: Mutations::CreateMySignup do
    guard ->(_obj, _args, ctx) { ctx[:user_con_profile] }
  end

  field :withdrawMySignup, mutation: Mutations::WithdrawMySignup do
    guard ->(_obj, _args, ctx) { ctx[:user_con_profile] }
  end

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

  field :forceConfirmSignup, mutation: Mutations::ForceConfirmSignup do
    guard(guard_for_convention_associated_model(:signups, :update))
  end

  field :updateSignupBucket, mutation: Mutations::UpdateSignupBucket do
    guard(guard_for_convention_associated_model(:signups, :update_bucket))
  end

  field :updateSignupCounted, mutation: Mutations::UpdateSignupCounted do
    guard(guard_for_convention_associated_model(:signups, :update))
  end

  ### StaffPosition

  field :createStaffPosition, mutation: Mutations::CreateStaffPosition do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        StaffPosition.new(args[:staff_position].to_h.merge(convention: ctx[:convention]))
      )
    }
  end

  field :updateStaffPosition, mutation: Mutations::UpdateStaffPosition do
    guard(guard_for_convention_associated_model(:staff_positions, :update))
  end

  field :updateStaffPositionPermissions, mutation: Mutations::UpdateStaffPositionPermissions do
    guard ->(_obj, args, ctx) {
      staff_position = ctx[:convention].staff_positions.find(args[:staff_position_id])
      ctx[:current_ability].can?(
        :create,
        Permission.new(staff_position: staff_position)
      )
    }
  end

  field :deleteStaffPosition, mutation: Mutations::DeleteStaffPosition do
    guard(guard_for_convention_associated_model(:staff_positions, :destroy))
  end

  ### TeamMember

  field :createTeamMember, mutation: Mutations::CreateTeamMember do
    guard(guard_for_create_event_associated_model(:team_members, :team_member))
  end

  field :deleteTeamMember, mutation: Mutations::DeleteTeamMember do
    guard(guard_for_model_with_id(TeamMember, :destroy))
  end

  field :updateTeamMember, mutation: Mutations::UpdateTeamMember do
    guard(guard_for_model_with_id(TeamMember, :update))
  end

  ### Ticket

  field :createTicket, mutation: Mutations::CreateTicket do
    guard(guard_for_create_convention_associated_model(:tickets))
  end

  field :updateTicket, mutation: Mutations::UpdateTicket do
    guard(guard_for_convention_associated_model(:tickets, :update))
  end

  field :deleteTicket, mutation: Mutations::DeleteTicket do
    guard(guard_for_convention_associated_model(:tickets, :destroy))
  end

  field :purchaseTicket, mutation: Mutations::PurchaseTicket do
    guard -> (_obj, _args, ctx) do
      ctx[:user_con_profile]
    end
  end

  field :provideEventTicket, mutation: Mutations::ProvideEventTicket do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ctx[:current_ability].can?(:update, event.team_members.new)
    }
  end

  field :convertTicketToEventProvided, mutation: Mutations::ConvertTicketToEventProvided do
    guard -> (_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      user_con_profile = ctx[:convention].user_con_profiles.find(args[:user_con_profile_id])
      ctx[:current_ability].can?(:destroy, user_con_profile.ticket) && ctx[:current_ability].can?(:update, event.team_members.new)
    }
  end

  ### TicketType

  field :createTicketType, mutation: Mutations::CreateTicketType do
    guard ->(_obj, args, ctx) {
      ctx[:current_ability].can?(
        :create,
        TicketType.new(args[:ticket_type].to_h.merge(convention: ctx[:convention]))
      )
    }
  end

  field :deleteTicketType, mutation: Mutations::DeleteTicketType do
    guard(guard_for_convention_associated_model(:ticket_types, :destroy))
  end

  field :updateTicketType, mutation: Mutations::UpdateTicketType do
    guard(guard_for_convention_associated_model(:ticket_types, :update))
  end

  ### UserActivityAlert

  field :createUserActivityAlert, mutation: Mutations::CreateUserActivityAlert do
    guard(guard_for_create_convention_associated_model(:user_activity_alerts))
  end

  field :deleteUserActivityAlert, mutation: Mutations::DeleteUserActivityAlert do
    guard(guard_for_convention_associated_model(:user_activity_alerts, :destroy))
  end

  field :updateUserActivityAlert, mutation: Mutations::UpdateUserActivityAlert do
    guard(guard_for_convention_associated_model(:user_activity_alerts, :update))
  end

  ### User

  field :mergeUsers, mutation: Mutations::MergeUsers do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:merge, User)
    }
  end

  ### UserConProfile

  field :createUserConProfile, mutation: Mutations::CreateUserConProfile do
    guard ->(_obj, _args, ctx) {
      ctx[:current_ability].can?(:create, UserConProfile.new(convention: ctx[:convention]))
    }
  end

  field :updateUserConProfile, mutation: Mutations::UpdateUserConProfile do
    guard ->(_obj, args, ctx) {
      user_con_profile = ctx[:convention].user_con_profiles.find(args[:id])
      if args[:user_con_profile][:privileges]
        return false unless ctx[:current_ability].can?(:update_privileges, user_con_profile)
      end

      ctx[:current_ability].can?(:update, user_con_profile)
    }
  end

  field :deleteUserConProfile, mutation: Mutations::DeleteUserConProfile do
    guard(guard_for_model_with_id(UserConProfile, :destroy))
  end
end
