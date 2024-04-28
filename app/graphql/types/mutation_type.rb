# frozen_string_literal: true
class Types::MutationType < Types::BaseObject
  graphql_name "Mutation"

  # CSRF verification, but only for mutations
  def self.authorized?(_value, context)
    raise ActionController::InvalidAuthenticityToken unless context[:verified_request]
    true
  end

  ### AuthorizedApplication

  field :revokeAuthorizedApplication, null: false, mutation: Mutations::RevokeAuthorizedApplication

  ### CmsContentGroup

  field :createCmsContentGroup, null: false, mutation: Mutations::CreateCmsContentGroup
  field :updateCmsContentGroup, null: false, mutation: Mutations::UpdateCmsContentGroup
  field :deleteCmsContentGroup, null: false, mutation: Mutations::DeleteCmsContentGroup

  ### CmsFile

  field :createCmsFile, null: false, mutation: Mutations::CreateCmsFile
  field :renameCmsFile, null: false, mutation: Mutations::RenameCmsFile
  field :deleteCmsFile, null: false, mutation: Mutations::DeleteCmsFile

  ### CmsGraphqlQuery

  field :createCmsGraphqlQuery, null: false, mutation: Mutations::CreateCmsGraphqlQuery
  field :updateCmsGraphqlQuery, null: false, mutation: Mutations::UpdateCmsGraphqlQuery
  field :deleteCmsGraphqlQuery, null: false, mutation: Mutations::DeleteCmsGraphqlQuery

  ### CmsLayout

  field :createCmsLayout, null: false, mutation: Mutations::CreateCmsLayout
  field :updateCmsLayout, null: false, mutation: Mutations::UpdateCmsLayout
  field :deleteCmsLayout, null: false, mutation: Mutations::DeleteCmsLayout

  ### CmsNavigationItem

  field :createCmsNavigationItem, null: false, mutation: Mutations::CreateCmsNavigationItem
  field :updateCmsNavigationItem, null: false, mutation: Mutations::UpdateCmsNavigationItem
  field :deleteCmsNavigationItem, null: false, mutation: Mutations::DeleteCmsNavigationItem
  field :sortCmsNavigationItems, null: false, mutation: Mutations::SortCmsNavigationItems

  ### CmsPartial

  field :createCmsPartial, null: false, mutation: Mutations::CreateCmsPartial
  field :updateCmsPartial, null: false, mutation: Mutations::UpdateCmsPartial
  field :deleteCmsPartial, null: false, mutation: Mutations::DeleteCmsPartial

  ### CmsVariable

  field :setCmsVariable, null: false, mutation: Mutations::SetCmsVariable
  field :deleteCmsVariable, null: false, mutation: Mutations::DeleteCmsVariable

  ### Convention

  field :createConvention, null: false, mutation: Mutations::CreateConvention
  field :updateConvention, null: false, mutation: Mutations::UpdateConvention
  field :setConventionCanceled, null: false, mutation: Mutations::SetConventionCanceled
  field :createConventionStripeAccount, null: false, mutation: Mutations::CreateConventionStripeAccount

  ### Coupon
  field :createCoupon, null: false, mutation: Mutations::CreateCoupon
  field :updateCoupon, null: false, mutation: Mutations::UpdateCoupon
  field :deleteCoupon, null: false, mutation: Mutations::DeleteCoupon

  ### CouponApplication
  field :createCouponApplication, null: false, mutation: Mutations::CreateCouponApplication
  field :deleteCouponApplication, null: false, mutation: Mutations::DeleteCouponApplication

  ### Department

  field :createDepartment, null: false, mutation: Mutations::CreateDepartment
  field :updateDepartment, null: false, mutation: Mutations::UpdateDepartment
  field :deleteDepartment, null: false, mutation: Mutations::DeleteDepartment

  ### EmailRoute

  field :createEmailRoute, null: false, mutation: Mutations::CreateEmailRoute
  field :updateEmailRoute, null: false, mutation: Mutations::UpdateEmailRoute
  field :deleteEmailRoute, null: false, mutation: Mutations::DeleteEmailRoute

  ### Event

  field :attachImageToEvent, null: false, mutation: Mutations::AttachImageToEvent
  field :createEvent, null: false, mutation: Mutations::CreateEvent
  field :createFillerEvent, null: false, mutation: Mutations::CreateFillerEvent
  field :dropEvent, null: false, mutation: Mutations::DropEvent
  field :restoreDroppedEvent, null: false, mutation: Mutations::RestoreDroppedEvent
  field :updateEvent, null: false, mutation: Mutations::UpdateEvent
  field :updateEventAdminNotes, null: false, mutation: Mutations::UpdateEventAdminNotes
  field :rateEvent, null: false, mutation: Mutations::RateEvent

  ### EventCategory

  field :createEventCategory, null: false, mutation: Mutations::CreateEventCategory
  field :updateEventCategory, null: false, mutation: Mutations::UpdateEventCategory
  field :deleteEventCategory, null: false, mutation: Mutations::DeleteEventCategory

  ### EventProposal

  field :createEventProposal, null: false, mutation: Mutations::CreateEventProposal
  field :updateEventProposal, null: false, mutation: Mutations::UpdateEventProposal
  field :attachImageToEventProposal, null: false, mutation: Mutations::AttachImageToEventProposal
  field :deleteEventProposal, null: false, mutation: Mutations::DeleteEventProposal
  field :submitEventProposal, null: false, mutation: Mutations::SubmitEventProposal
  field :transitionEventProposal, null: false, mutation: Mutations::TransitionEventProposal
  field :updateEventProposalAdminNotes, null: false, mutation: Mutations::UpdateEventProposalAdminNotes

  ### Form

  field :createFormWithJSON, null: false, mutation: Mutations::CreateFormWithJSON
  field :updateFormWithJSON, null: false, mutation: Mutations::UpdateFormWithJSON
  field :createForm, null: false, mutation: Mutations::CreateForm
  field :updateForm, null: false, mutation: Mutations::UpdateForm
  field :deleteForm, null: false, mutation: Mutations::DeleteForm

  ### FormItem

  field :createFormItem, null: false, mutation: Mutations::CreateFormItem
  field :updateFormItem, null: false, mutation: Mutations::UpdateFormItem
  field :moveFormItem, null: false, mutation: Mutations::MoveFormItem
  field :deleteFormItem, null: false, mutation: Mutations::DeleteFormItem

  ### FormSection

  field :createFormSection, null: false, mutation: Mutations::CreateFormSection
  field :updateFormSection, null: false, mutation: Mutations::UpdateFormSection
  field :moveFormSection, null: false, mutation: Mutations::MoveFormSection
  field :deleteFormSection, null: false, mutation: Mutations::DeleteFormSection

  ### MaximumEventProvidedTicketsOverride

  field :createMaximumEventProvidedTicketsOverride,
        null: false,
        mutation: Mutations::CreateMaximumEventProvidedTicketsOverride
  field :updateMaximumEventProvidedTicketsOverride,
        null: false,
        mutation: Mutations::UpdateMaximumEventProvidedTicketsOverride
  field :deleteMaximumEventProvidedTicketsOverride,
        null: false,
        mutation: Mutations::DeleteMaximumEventProvidedTicketsOverride

  ### NotificationTemplate

  field :updateNotificationTemplate, null: false, mutation: Mutations::UpdateNotificationTemplate
  field :sendNotificationPreview, null: false, mutation: Mutations::SendNotificationPreview

  ### OrderEntry

  field :addOrderEntryToCurrentPendingOrder, null: false, mutation: Mutations::AddOrderEntryToCurrentPendingOrder
  field :createOrderEntry, null: false, mutation: Mutations::CreateOrderEntry
  field :updateOrderEntry, null: false, mutation: Mutations::UpdateOrderEntry
  field :deleteOrderEntry, null: false, mutation: Mutations::DeleteOrderEntry

  ### Order

  field :submitOrder, null: false, mutation: Mutations::SubmitOrder
  field :createOrder, null: false, mutation: Mutations::CreateOrder
  field :markOrderPaid, null: false, mutation: Mutations::MarkOrderPaid
  field :updateOrder, null: false, mutation: Mutations::UpdateOrder
  field :cancelOrder, null: false, mutation: Mutations::CancelOrder

  ### OrganizationRole

  field :createOrganizationRole, null: false, mutation: Mutations::CreateOrganizationRole
  field :updateOrganizationRole, null: false, mutation: Mutations::UpdateOrganizationRole
  field :deleteOrganizationRole, null: false, mutation: Mutations::DeleteOrganizationRole

  ### Page

  field :createPage, null: false, mutation: Mutations::CreatePage
  field :updatePage, null: false, mutation: Mutations::UpdatePage
  field :deletePage, null: false, mutation: Mutations::DeletePage

  ### Product

  field :createProduct, null: false, mutation: Mutations::CreateProduct
  field :updateProduct, null: false, mutation: Mutations::UpdateProduct
  field :deleteProduct, null: false, mutation: Mutations::DeleteProduct

  ### Room

  field :createRoom, null: false, mutation: Mutations::CreateRoom
  field :updateRoom, null: false, mutation: Mutations::UpdateRoom
  field :deleteRoom, null: false, mutation: Mutations::DeleteRoom

  ### RootSite

  field :updateRootSite, null: false, mutation: Mutations::UpdateRootSite

  ### Run

  field :createRun, null: false, mutation: Mutations::CreateRun
  field :createMultipleRuns, null: false, mutation: Mutations::CreateMultipleRuns
  field :deleteRun, null: false, mutation: Mutations::DeleteRun
  field :updateRun, null: false, mutation: Mutations::UpdateRun

  ### Signup

  field :createMySignup, null: false, mutation: Mutations::CreateMySignup
  field :withdrawMySignup, null: false, mutation: Mutations::WithdrawMySignup
  field :createUserSignup, null: false, mutation: Mutations::CreateUserSignup
  field :withdrawUserSignup, null: false, mutation: Mutations::WithdrawUserSignup
  field :forceConfirmSignup, null: false, mutation: Mutations::ForceConfirmSignup
  field :updateSignupBucket, null: false, mutation: Mutations::UpdateSignupBucket
  field :updateSignupCounted, null: false, mutation: Mutations::UpdateSignupCounted

  ### SignupRankedChoice

  field :createSignupRankedChoice, null: false, mutation: Mutations::CreateSignupRankedChoice
  field :deleteSignupRankedChoice, null: false, mutation: Mutations::DeleteSignupRankedChoice
  field :updateSignupRankedChoicePriority, null: false, mutation: Mutations::UpdateSignupRankedChoicePriority

  ### SignupRequest

  field :createSignupRequest, null: false, mutation: Mutations::CreateSignupRequest
  field :withdrawSignupRequest, null: false, mutation: Mutations::WithdrawSignupRequest
  field :acceptSignupRequest, null: false, mutation: Mutations::AcceptSignupRequest
  field :rejectSignupRequest, null: false, mutation: Mutations::RejectSignupRequest

  ### StaffPosition

  field :createStaffPosition, null: false, mutation: Mutations::CreateStaffPosition
  field :updateStaffPosition, null: false, mutation: Mutations::UpdateStaffPosition
  field :updateStaffPositionPermissions, null: false, mutation: Mutations::UpdateStaffPositionPermissions
  field :deleteStaffPosition, null: false, mutation: Mutations::DeleteStaffPosition

  ### TeamMember

  field :createTeamMember, null: false, mutation: Mutations::CreateTeamMember
  field :deleteTeamMember, null: false, mutation: Mutations::DeleteTeamMember
  field :updateTeamMember, null: false, mutation: Mutations::UpdateTeamMember

  ### Ticket

  field :createTicket, null: false, mutation: Mutations::CreateTicket
  field :updateTicket, null: false, mutation: Mutations::UpdateTicket
  field :deleteTicket, null: false, mutation: Mutations::DeleteTicket
  field :provideEventTicket, null: false, mutation: Mutations::ProvideEventTicket
  field :convertTicketToEventProvided, null: false, mutation: Mutations::ConvertTicketToEventProvided

  ### TicketType

  field :createTicketType, null: false, mutation: Mutations::CreateTicketType
  field :deleteTicketType, null: false, mutation: Mutations::DeleteTicketType
  field :updateTicketType, null: false, mutation: Mutations::UpdateTicketType

  ### UserActivityAlert

  field :createUserActivityAlert, null: false, mutation: Mutations::CreateUserActivityAlert
  field :deleteUserActivityAlert, null: false, mutation: Mutations::DeleteUserActivityAlert
  field :updateUserActivityAlert, null: false, mutation: Mutations::UpdateUserActivityAlert

  ### User

  field :mergeUsers, null: false, mutation: Mutations::MergeUsers

  ### UserConProfile

  field :createUserConProfile, null: false, mutation: Mutations::CreateUserConProfile
  field :updateUserConProfile, null: false, mutation: Mutations::UpdateUserConProfile
  field :deleteUserConProfile, null: false, mutation: Mutations::DeleteUserConProfile
  field :withdrawAllUserConProfileSignups, null: false, mutation: Mutations::WithdrawAllUserConProfileSignups
  field :acceptClickwrapAgreement, null: false, mutation: Mutations::AcceptClickwrapAgreement
end
