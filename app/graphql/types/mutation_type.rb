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

  field :createEventProposal, mutation: Mutations::CreateEventProposal
  field :updateEventProposal, mutation: Mutations::UpdateEventProposal
  field :deleteEventProposal, mutation: Mutations::DeleteEventProposal
  field :submitEventProposal, mutation: Mutations::SubmitEventProposal
  field :transitionEventProposal, mutation: Mutations::TransitionEventProposal
  field :updateEventProposalAdminNotes, mutation: Mutations::UpdateEventProposalAdminNotes

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

  field :updateRootSite, mutation: Mutations::UpdateRootSite

  ### Run

  field :createRun, mutation: Mutations::CreateRun
  field :createMultipleRuns, mutation: Mutations::CreateMultipleRuns
  field :deleteRun, mutation: Mutations::DeleteRun
  field :updateRun, mutation: Mutations::UpdateRun

  ### Signup

  field :createMySignup, mutation: Mutations::CreateMySignup
  field :withdrawMySignup, mutation: Mutations::WithdrawMySignup
  field :createUserSignup, mutation: Mutations::CreateUserSignup
  field :withdrawUserSignup, mutation: Mutations::WithdrawUserSignup
  field :forceConfirmSignup, mutation: Mutations::ForceConfirmSignup
  field :updateSignupBucket, mutation: Mutations::UpdateSignupBucket
  field :updateSignupCounted, mutation: Mutations::UpdateSignupCounted

  ### SignupRequest

  field :createSignupRequest, mutation: Mutations::CreateSignupRequest
  field :withdrawSignupRequest, mutation: Mutations::WithdrawSignupRequest
  field :acceptSignupRequest, mutation: Mutations::AcceptSignupRequest
  field :rejectSignupRequest, mutation: Mutations::RejectSignupRequest

  ### StaffPosition

  field :createStaffPosition, mutation: Mutations::CreateStaffPosition
  field :updateStaffPosition, mutation: Mutations::UpdateStaffPosition
  field :updateStaffPositionPermissions, mutation: Mutations::UpdateStaffPositionPermissions
  field :deleteStaffPosition, mutation: Mutations::DeleteStaffPosition

  ### TeamMember

  field :createTeamMember, mutation: Mutations::CreateTeamMember
  field :deleteTeamMember, mutation: Mutations::DeleteTeamMember
  field :updateTeamMember, mutation: Mutations::UpdateTeamMember

  ### Ticket

  field :createTicket, mutation: Mutations::CreateTicket
  field :updateTicket, mutation: Mutations::UpdateTicket
  field :deleteTicket, mutation: Mutations::DeleteTicket

  field :purchaseTicket, mutation: Mutations::PurchaseTicket do
    guard -> (_obj, _args, ctx) do
      ctx[:user_con_profile]
    end
  end

  field :provideEventTicket, mutation: Mutations::ProvideEventTicket
  field :convertTicketToEventProvided, mutation: Mutations::ConvertTicketToEventProvided

  ### TicketType

  field :createTicketType, mutation: Mutations::CreateTicketType
  field :deleteTicketType, mutation: Mutations::DeleteTicketType
  field :updateTicketType, mutation: Mutations::UpdateTicketType

  ### UserActivityAlert

  field :createUserActivityAlert, mutation: Mutations::CreateUserActivityAlert
  field :deleteUserActivityAlert, mutation: Mutations::DeleteUserActivityAlert
  field :updateUserActivityAlert, mutation: Mutations::UpdateUserActivityAlert

  ### User

  field :mergeUsers, mutation: Mutations::MergeUsers

  ### UserConProfile

  field :createUserConProfile, mutation: Mutations::CreateUserConProfile
  field :updateUserConProfile, mutation: Mutations::UpdateUserConProfile
  field :deleteUserConProfile, mutation: Mutations::DeleteUserConProfile
  field :withdrawAllUserConProfileSignups, mutation: Mutations::WithdrawAllUserConProfileSignups
  field :acceptClickwrapAgreement, mutation: Mutations::AcceptClickwrapAgreement
end
