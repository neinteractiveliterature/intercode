# frozen_string_literal: true
# rubocop:disable GraphQL/FieldName, GraphQL/FieldDescription, GraphQL/ExtractType
class Types::MutationType < Types::BaseObject # rubocop:disable GraphQL/ObjectDescription
  class MutationRootField < Types::BaseField # rubocop:disable GraphQL/ObjectDescription
    def initialize(*, resolver_class:, **, &)
      super(*, resolver_class:, description: resolver_class.description, **, &)
    end
  end

  field_class MutationRootField

  # CSRF verification, but only for mutations
  def self.authorized?(_value, context)
    raise ActionController::InvalidAuthenticityToken unless context[:verified_request]
    true
  end

  ### AuthorizedApplication

  field :revokeAuthorizedApplication, null: false, mutation: Mutations::RevokeAuthorizedApplication

  ### CmsContentGroup

  field :createCmsContentGroup, null: false, mutation: Mutations::CreateCmsContentGroup
  field :deleteCmsContentGroup, null: false, mutation: Mutations::DeleteCmsContentGroup
  field :updateCmsContentGroup, null: false, mutation: Mutations::UpdateCmsContentGroup

  ### CmsFile

  field :createCmsFile, null: false, mutation: Mutations::CreateCmsFile
  field :deleteCmsFile, null: false, mutation: Mutations::DeleteCmsFile
  field :renameCmsFile, null: false, mutation: Mutations::RenameCmsFile

  ### CmsGraphqlQuery

  field :createCmsGraphqlQuery, null: false, mutation: Mutations::CreateCmsGraphqlQuery
  field :deleteCmsGraphqlQuery, null: false, mutation: Mutations::DeleteCmsGraphqlQuery
  field :updateCmsGraphqlQuery, null: false, mutation: Mutations::UpdateCmsGraphqlQuery

  ### CmsLayout

  field :createCmsLayout, null: false, mutation: Mutations::CreateCmsLayout
  field :deleteCmsLayout, null: false, mutation: Mutations::DeleteCmsLayout
  field :updateCmsLayout, null: false, mutation: Mutations::UpdateCmsLayout

  ### CmsNavigationItem

  field :createCmsNavigationItem, null: false, mutation: Mutations::CreateCmsNavigationItem
  field :deleteCmsNavigationItem, null: false, mutation: Mutations::DeleteCmsNavigationItem
  field :sortCmsNavigationItems, null: false, mutation: Mutations::SortCmsNavigationItems
  field :updateCmsNavigationItem, null: false, mutation: Mutations::UpdateCmsNavigationItem

  ### CmsPartial

  field :createCmsPartial, null: false, mutation: Mutations::CreateCmsPartial
  field :deleteCmsPartial, null: false, mutation: Mutations::DeleteCmsPartial
  field :updateCmsPartial, null: false, mutation: Mutations::UpdateCmsPartial

  ### CmsVariable

  field :deleteCmsVariable, null: false, mutation: Mutations::DeleteCmsVariable
  field :setCmsVariable, null: false, mutation: Mutations::SetCmsVariable

  ### Convention

  field :createConvention, null: false, mutation: Mutations::CreateConvention
  field :createConventionStripeAccount, null: false, mutation: Mutations::CreateConventionStripeAccount
  field :setConventionCanceled, null: false, mutation: Mutations::SetConventionCanceled
  field :updateConvention, null: false, mutation: Mutations::UpdateConvention

  ### Coupon
  field :createCoupon, null: false, mutation: Mutations::CreateCoupon
  field :deleteCoupon, null: false, mutation: Mutations::DeleteCoupon
  field :updateCoupon, null: false, mutation: Mutations::UpdateCoupon

  ### CouponApplication
  field :createCouponApplication, null: false, mutation: Mutations::CreateCouponApplication
  field :deleteCouponApplication, null: false, mutation: Mutations::DeleteCouponApplication

  ### Department

  field :createDepartment, null: false, mutation: Mutations::CreateDepartment
  field :deleteDepartment, null: false, mutation: Mutations::DeleteDepartment
  field :updateDepartment, null: false, mutation: Mutations::UpdateDepartment

  ### EmailRoute

  field :createEmailRoute, null: false, mutation: Mutations::CreateEmailRoute
  field :deleteEmailRoute, null: false, mutation: Mutations::DeleteEmailRoute
  field :updateEmailRoute, null: false, mutation: Mutations::UpdateEmailRoute

  ### Event

  field :attachImageToEvent, null: false, mutation: Mutations::AttachImageToEvent
  field :createEvent, null: false, mutation: Mutations::CreateEvent
  field :createFillerEvent, null: false, mutation: Mutations::CreateFillerEvent
  field :dropEvent, null: false, mutation: Mutations::DropEvent
  field :freezeBucketAssignments, null: false, mutation: Mutations::FreezeBucketAssignments
  field :rateEvent, null: false, mutation: Mutations::RateEvent
  field :restoreDroppedEvent, null: false, mutation: Mutations::RestoreDroppedEvent
  field :updateEvent, null: false, mutation: Mutations::UpdateEvent
  field :updateEventAdminNotes, null: false, mutation: Mutations::UpdateEventAdminNotes

  ### EventCategory

  field :createEventCategory, null: false, mutation: Mutations::CreateEventCategory
  field :deleteEventCategory, null: false, mutation: Mutations::DeleteEventCategory
  field :updateEventCategory, null: false, mutation: Mutations::UpdateEventCategory

  ### EventProposal

  field :attachImageToEventProposal, null: false, mutation: Mutations::AttachImageToEventProposal
  field :createEventProposal, null: false, mutation: Mutations::CreateEventProposal
  field :deleteEventProposal, null: false, mutation: Mutations::DeleteEventProposal
  field :submitEventProposal, null: false, mutation: Mutations::SubmitEventProposal
  field :transitionEventProposal, null: false, mutation: Mutations::TransitionEventProposal
  field :updateEventProposal, null: false, mutation: Mutations::UpdateEventProposal
  field :updateEventProposalAdminNotes, null: false, mutation: Mutations::UpdateEventProposalAdminNotes

  ### Form

  field :createForm, null: false, mutation: Mutations::CreateForm
  field :createFormWithJSON, null: false, mutation: Mutations::CreateFormWithJSON
  field :deleteForm, null: false, mutation: Mutations::DeleteForm
  field :updateForm, null: false, mutation: Mutations::UpdateForm
  field :updateFormWithJSON, null: false, mutation: Mutations::UpdateFormWithJSON

  ### FormItem

  field :createFormItem, null: false, mutation: Mutations::CreateFormItem
  field :deleteFormItem, null: false, mutation: Mutations::DeleteFormItem
  field :moveFormItem, null: false, mutation: Mutations::MoveFormItem
  field :updateFormItem, null: false, mutation: Mutations::UpdateFormItem

  ### FormSection

  field :createFormSection, null: false, mutation: Mutations::CreateFormSection
  field :deleteFormSection, null: false, mutation: Mutations::DeleteFormSection
  field :moveFormSection, null: false, mutation: Mutations::MoveFormSection
  field :updateFormSection, null: false, mutation: Mutations::UpdateFormSection

  ### MaximumEventProvidedTicketsOverride

  field :createMaximumEventProvidedTicketsOverride,
        null: false,
        mutation: Mutations::CreateMaximumEventProvidedTicketsOverride
  field :deleteMaximumEventProvidedTicketsOverride,
        null: false,
        mutation: Mutations::DeleteMaximumEventProvidedTicketsOverride
  field :updateMaximumEventProvidedTicketsOverride,
        null: false,
        mutation: Mutations::UpdateMaximumEventProvidedTicketsOverride

  ### NotificationTemplate

  field :sendNotificationPreview, null: false, mutation: Mutations::SendNotificationPreview
  field :updateNotificationTemplate, null: false, mutation: Mutations::UpdateNotificationTemplate

  ### OrderEntry

  field :addOrderEntryToCurrentPendingOrder, null: false, mutation: Mutations::AddOrderEntryToCurrentPendingOrder
  field :createOrderEntry, null: false, mutation: Mutations::CreateOrderEntry
  field :deleteOrderEntry, null: false, mutation: Mutations::DeleteOrderEntry
  field :updateOrderEntry, null: false, mutation: Mutations::UpdateOrderEntry

  ### Order

  field :cancelOrder, null: false, mutation: Mutations::CancelOrder
  field :createOrder, null: false, mutation: Mutations::CreateOrder
  field :markOrderPaid, null: false, mutation: Mutations::MarkOrderPaid
  field :submitOrder, null: false, mutation: Mutations::SubmitOrder
  field :updateOrder, null: false, mutation: Mutations::UpdateOrder

  ### OrganizationRole

  field :createOrganizationRole, null: false, mutation: Mutations::CreateOrganizationRole
  field :deleteOrganizationRole, null: false, mutation: Mutations::DeleteOrganizationRole
  field :updateOrganizationRole, null: false, mutation: Mutations::UpdateOrganizationRole

  ### Page

  field :createPage, null: false, mutation: Mutations::CreatePage
  field :deletePage, null: false, mutation: Mutations::DeletePage
  field :updatePage, null: false, mutation: Mutations::UpdatePage

  ### Product

  field :createProduct, null: false, mutation: Mutations::CreateProduct
  field :deleteProduct, null: false, mutation: Mutations::DeleteProduct
  field :updateProduct, null: false, mutation: Mutations::UpdateProduct

  ### RankedChoiceUserConstraint

  field :createRankedChoiceUserConstraint, null: false, mutation: Mutations::CreateRankedChoiceUserConstraint
  field :deleteRankedChoiceUserConstraint, null: false, mutation: Mutations::DeleteRankedChoiceUserConstraint
  field :updateRankedChoiceUserConstraint, null: false, mutation: Mutations::UpdateRankedChoiceUserConstraint

  ### Room

  field :createRoom, null: false, mutation: Mutations::CreateRoom
  field :deleteRoom, null: false, mutation: Mutations::DeleteRoom
  field :updateRoom, null: false, mutation: Mutations::UpdateRoom

  ### RootSite

  field :updateRootSite, null: false, mutation: Mutations::UpdateRootSite

  ### Run

  field :createMultipleRuns, null: false, mutation: Mutations::CreateMultipleRuns
  field :createOrUpdateRunForEvent, null: false, mutation: Mutations::CreateOrUpdateRunForEvent
  field :createRun, null: false, mutation: Mutations::CreateRun
  field :deleteRun, null: false, mutation: Mutations::DeleteRun
  field :updateRun, null: false, mutation: Mutations::UpdateRun

  ### Signup

  field :createMySignup, null: false, mutation: Mutations::CreateMySignup
  field :createUserSignup, null: false, mutation: Mutations::CreateUserSignup
  field :forceConfirmSignup, null: false, mutation: Mutations::ForceConfirmSignup
  field :updateSignupBucket, null: false, mutation: Mutations::UpdateSignupBucket
  field :updateSignupCounted, null: false, mutation: Mutations::UpdateSignupCounted
  field :withdrawMySignup, null: false, mutation: Mutations::WithdrawMySignup
  field :withdrawUserSignup, null: false, mutation: Mutations::WithdrawUserSignup

  ### SignupRankedChoice

  field :createSignupRankedChoice, null: false, mutation: Mutations::CreateSignupRankedChoice
  field :deleteSignupRankedChoice, null: false, mutation: Mutations::DeleteSignupRankedChoice
  field :setSignupRankedChoicePrioritzeWaitlist,
        null: false,
        mutation: Mutations::SetSignupRankedChoicePrioritizeWaitlist
  field :updateSignupRankedChoicePriority, null: false, mutation: Mutations::UpdateSignupRankedChoicePriority

  ### SignupRequest

  field :acceptSignupRequest, null: false, mutation: Mutations::AcceptSignupRequest
  field :createSignupRequest, null: false, mutation: Mutations::CreateSignupRequest
  field :rejectSignupRequest, null: false, mutation: Mutations::RejectSignupRequest
  field :withdrawSignupRequest, null: false, mutation: Mutations::WithdrawSignupRequest

  ### SignupRound

  field :createSignupRound, null: false, mutation: Mutations::CreateSignupRound
  field :deleteSignupRound, null: false, mutation: Mutations::DeleteSignupRound
  field :rerunModeratedRankedChoiceSignupRound, null: false, mutation: Mutations::RerunModeratedRankedChoiceSignupRound
  field :updateSignupRound, null: false, mutation: Mutations::UpdateSignupRound

  ### StaffPosition

  field :createStaffPosition, null: false, mutation: Mutations::CreateStaffPosition
  field :deleteStaffPosition, null: false, mutation: Mutations::DeleteStaffPosition
  field :updateStaffPosition, null: false, mutation: Mutations::UpdateStaffPosition
  field :updateStaffPositionPermissions, null: false, mutation: Mutations::UpdateStaffPositionPermissions

  ### TeamMember

  field :createTeamMember, null: false, mutation: Mutations::CreateTeamMember
  field :deleteTeamMember, null: false, mutation: Mutations::DeleteTeamMember
  field :updateTeamMember, null: false, mutation: Mutations::UpdateTeamMember

  ### Ticket

  field :convertTicketToEventProvided, null: false, mutation: Mutations::ConvertTicketToEventProvided
  field :createTicket, null: false, mutation: Mutations::CreateTicket
  field :deleteTicket, null: false, mutation: Mutations::DeleteTicket
  field :provideEventTicket, null: false, mutation: Mutations::ProvideEventTicket
  field :updateTicket, null: false, mutation: Mutations::UpdateTicket

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

  field :acceptClickwrapAgreement, null: false, mutation: Mutations::AcceptClickwrapAgreement
  field :createUserConProfile, null: false, mutation: Mutations::CreateUserConProfile
  field :deleteUserConProfile, null: false, mutation: Mutations::DeleteUserConProfile
  field :updateUserConProfile, null: false, mutation: Mutations::UpdateUserConProfile
  field :withdrawAllUserConProfileSignups, null: false, mutation: Mutations::WithdrawAllUserConProfileSignups
end
