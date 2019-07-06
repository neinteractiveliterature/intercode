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
  def self.authorized?(_value, context)
    raise ActionController::InvalidAuthenticityToken unless context[:verified_request]
    true
  end

  ### CmsFile

  field :createCmsFile, mutation: Mutations::CreateCmsFile
  field :deleteCmsFile, mutation: Mutations::DeleteCmsFile

  ### CmsGraphqlQuery

  field :createCmsGraphqlQuery, mutation: Mutations::CreateCmsGraphqlQuery
  field :updateCmsGraphqlQuery, mutation: Mutations::UpdateCmsGraphqlQuery
  field :deleteCmsGraphqlQuery, mutation: Mutations::DeleteCmsGraphqlQuery

  ### CmsLayout

  field :createCmsLayout, mutation: Mutations::CreateCmsLayout
  field :updateCmsLayout, mutation: Mutations::UpdateCmsLayout
  field :deleteCmsLayout, mutation: Mutations::DeleteCmsLayout

  ### CmsNavigationItem

  field :createCmsNavigationItem, mutation: Mutations::CreateCmsNavigationItem
  field :updateCmsNavigationItem, mutation: Mutations::UpdateCmsNavigationItem
  field :deleteCmsNavigationItem, mutation: Mutations::DeleteCmsNavigationItem
  field :sortCmsNavigationItems, mutation: Mutations::SortCmsNavigationItems

  ### CmsPartial

  field :createCmsPartial, mutation: Mutations::CreateCmsPartial
  field :updateCmsPartial, mutation: Mutations::UpdateCmsPartial
  field :deleteCmsPartial, mutation: Mutations::DeleteCmsPartial

  ### CmsVariable

  field :setCmsVariable, mutation: Mutations::SetCmsVariable
  field :deleteCmsVariable, mutation: Mutations::DeleteCmsVariable

  ### Convention

  field :updateConvention, mutation: Mutations::UpdateConvention

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

  field :createEventCategory, mutation: Mutations::CreateEventCategory
  field :updateEventCategory, mutation: Mutations::UpdateEventCategory
  field :deleteEventCategory, mutation: Mutations::DeleteEventCategory

  ### EventProposal

  field :createEventProposal, mutation: Mutations::CreateEventProposal do
    guard(guard_for_create_convention_associated_model(:event_proposals))
  end

  field :updateEventProposal, mutation: Mutations::UpdateEventProposal do
    guard(guard_for_convention_associated_model(:event_proposals, :update))
  end

  field :deleteEventProposal, mutation: Mutations::DeleteEventProposal do
    guard(guard_for_convention_associated_model(:event_proposals, :destroy))
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

  field :createFormWithJSON, mutation: Mutations::CreateFormWithJSON
  field :updateFormWithJSON, mutation: Mutations::UpdateFormWithJSON
  field :deleteForm, mutation: Mutations::DeleteForm

  ### MaximumEventProvidedTicketsOverride

  field :createMaximumEventProvidedTicketsOverride,
    mutation: Mutations::CreateMaximumEventProvidedTicketsOverride
  field :updateMaximumEventProvidedTicketsOverride,
    mutation: Mutations::UpdateMaximumEventProvidedTicketsOverride
  field :deleteMaximumEventProvidedTicketsOverride,
    mutation: Mutations::DeleteMaximumEventProvidedTicketsOverride

  ### Order / OrderEntry

  field :addOrderEntryToCurrentPendingOrder, mutation: Mutations::AddOrderEntryToCurrentPendingOrder do
    guard -> (_obj, _args, ctx) { ctx[:user_con_profile] }
  end

  field :updateOrderEntry, mutation: Mutations::UpdateOrderEntry
  field :deleteOrderEntry, mutation: Mutations::DeleteOrderEntry

  field :submitOrder, mutation: Mutations::SubmitOrder
  field :markOrderPaid, mutation: Mutations::MarkOrderPaid
  field :updateOrder, mutation: Mutations::UpdateOrder
  field :cancelOrder, mutation: Mutations::CancelOrder

  ### OrganizationRole

  field :createOrganizationRole, mutation: Mutations::CreateOrganizationRole
  field :updateOrganizationRole, mutation: Mutations::UpdateOrganizationRole
  field :deleteOrganizationRole, mutation: Mutations::DeleteOrganizationRole

  ### Page

  field :createPage, mutation: Mutations::CreatePage
  field :updatePage, mutation: Mutations::UpdatePage
  field :deletePage, mutation: Mutations::DeletePage

  ### Product

  field :createProduct, mutation: Mutations::CreateProduct
  field :updateProduct, mutation: Mutations::UpdateProduct
  field :deleteProduct, mutation: Mutations::DeleteProduct

  ### Room

  field :createRoom, mutation: Mutations::CreateRoom
  field :updateRoom, mutation: Mutations::UpdateRoom
  field :deleteRoom, mutation: Mutations::DeleteRoom

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

  field :createUserSignup, mutation: Mutations::CreateUserSignup do
    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(
        :create,
        Signup.new(
          user_con_profile: ctx[:convention].user_con_profiles.find(args[:user_con_profile_id]),
          run: ctx[:convention].runs.find(args[:run_id])
        )
      )
    end
  end

  field :withdrawUserSignup, mutation: Mutations::WithdrawUserSignup do
    guard ->(_obj, args, ctx) do
      ctx[:current_ability].can?(
        :update,
        Signup.find_by(run_id: args[:run_id], user_con_profile_id: args[:user_con_profile_id])
      )
    end
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
    guard(guard_for_convention_associated_model(:signups, :force_confirm))
  end

  field :updateSignupBucket, mutation: Mutations::UpdateSignupBucket do
    guard(guard_for_convention_associated_model(:signups, :update_bucket))
  end

  field :updateSignupCounted, mutation: Mutations::UpdateSignupCounted do
    guard(guard_for_convention_associated_model(:signups, :update_counted))
  end

  ### SignupRequest

  field :createSignupRequest, mutation: Mutations::CreateSignupRequest do
    guard ->(_obj, _args, ctx) { ctx[:current_ability].can?(:create, SignupRequest) }
  end

  field :withdrawSignupRequest, mutation: Mutations::WithdrawSignupRequest do
    guard(guard_for_model_with_id(SignupRequest, :withdraw))
  end

  field :acceptSignupRequest, mutation: Mutations::AcceptSignupRequest do
    guard(guard_for_model_with_id(SignupRequest, :accept))
  end

  field :rejectSignupRequest, mutation: Mutations::RejectSignupRequest do
    guard(guard_for_model_with_id(SignupRequest, :reject))
  end

  ### StaffPosition

  field :createStaffPosition, mutation: Mutations::CreateStaffPosition
  field :updateStaffPosition, mutation: Mutations::UpdateStaffPosition
  field :updateStaffPositionPermissions, mutation: Mutations::UpdateStaffPositionPermissions
  field :deleteStaffPosition, mutation: Mutations::DeleteStaffPosition

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

  field :createTicket, mutation: Mutations::CreateTicket
  field :updateTicket, mutation: Mutations::UpdateTicket
  field :deleteTicket, mutation: Mutations::DeleteTicket

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

  field :convertTicketToEventProvided, mutation: Mutations::ConvertTicketToEventProvided

  ### TicketType

  field :createTicketType, mutation: Mutations::CreateTicketType
  field :deleteTicketType, mutation: Mutations::DeleteTicketType
  field :updateTicketType, mutation: Mutations::UpdateTicketType

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

  field :acceptClickwrapAgreement, mutation: Mutations::AcceptClickwrapAgreement
end
