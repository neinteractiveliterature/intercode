class Types::AbilityType < Types::BaseObject # rubocop:disable Metrics/ClassLength
  field :can_create_pages, Boolean, null: false
  def can_create_pages
    policy(Page.new(parent: convention)).create?
  end

  field :can_create_cms_partials, Boolean, null: false
  def can_create_cms_partials
    policy(CmsPartial.new(parent: convention)).create?
  end

  field :can_create_cms_files, Boolean, null: false
  def can_create_cms_files
    policy(CmsFile.new(parent: convention)).create?
  end

  field :can_create_cms_layouts, Boolean, null: false
  def can_create_cms_layouts
    policy(CmsLayout.new(parent: convention)).create?
  end

  field :can_create_cms_navigation_items, Boolean, null: false
  def can_create_cms_navigation_items
    policy(CmsNavigationItem.new(parent: convention)).create?
  end

  field :can_create_cms_variables, Boolean, null: false
  def can_create_cms_variables
    policy(CmsVariable.new(parent: convention)).create?
  end

  field :can_create_cms_graphql_queries, Boolean, null: false
  def can_create_cms_graphql_queries
    policy(CmsGraphqlQuery.new(parent: convention)).create?
  end

  field :can_create_cms_content_groups, Boolean, null: false
  def can_create_cms_content_groups
    policy(CmsContentGroup.new(parent: convention)).create?
  end

  field :can_manage_any_cms_content, Boolean, null: false
  def can_manage_any_cms_content
    PagePolicy::ManageScope.new(pundit_user, cms_parent.pages).resolve.any?
  end

  field :can_manage_conventions, Boolean, null: false
  def can_manage_conventions
    policy(Convention.new).manage?
  end

  field :can_update_convention, Boolean, null: false
  def can_update_convention
    !!(convention && convention_policy.update?)
  end

  field :can_manage_email_routes, Boolean, null: false
  def can_manage_email_routes
    policy(EmailRoute.new).manage?
  end

  field :can_override_maximum_event_provided_tickets, Boolean, null: false

  def can_override_maximum_event_provided_tickets
    override = MaximumEventProvidedTicketsOverride.new(
      event: Event.new(convention: convention)
    )
    policy(override).create?
  end

  field :can_update_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_update_signup(**args)
    ModelPermissionLoader.for(Signup).load([pundit_user, :update, args[:signup_id]])
  end

  field :can_update_counted_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_update_counted_signup(**args)
    ModelPermissionLoader.for(Signup).load([pundit_user, :update_counted, args[:signup_id]])
  end

  field :can_force_confirm_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_force_confirm_signup(**args)
    ModelPermissionLoader.for(Signup).load([pundit_user, :force_confirm, args[:signup_id]])
  end

  field :can_update_bucket_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_update_bucket_signup(**args)
    ModelPermissionLoader.for(Signup).load([pundit_user, :update_bucket, args[:signup_id]])
  end

  field :can_update_event_categories, Boolean, null: false

  def can_update_event_categories
    !!(convention && policy(EventCategory.new(convention: convention)).update?)
  end

  field :can_update_event, Boolean, null: false do
    argument :event_id, Integer, required: true, camelize: false
  end

  def can_update_event(**args)
    ModelPermissionLoader.for(Event).load([pundit_user, :update, args[:event_id]])
  end

  field :can_delete_event, Boolean, null: false do
    argument :event_id, Integer, required: true, camelize: false
  end

  def can_delete_event(**args)
    ModelPermissionLoader.for(Event).load([pundit_user, :destroy, args[:event_id]])
  end

  field :can_read_orders, Boolean, null: false

  def can_read_orders
    !!(
      convention &&
      policy(Order.new(user_con_profile: UserConProfile.new(convention: convention))).read?
    )
  end

  field :can_read_schedule, Boolean, null: false

  def can_read_schedule
    !!(convention && convention_policy.schedule?)
  end

  field :can_read_schedule_with_counts, Boolean, null: false

  def can_read_schedule_with_counts
    !!(convention && convention_policy.schedule_with_counts?)
  end

  field :can_list_events, Boolean, null: false

  def can_list_events
    !!(convention && convention_policy.list_events?)
  end

  field :can_read_event_proposals, Boolean, null: false

  def can_read_event_proposals
    !!(convention && convention_policy.view_event_proposals?)
  end

  field :can_read_any_mailing_list, Boolean, null: false

  def can_read_any_mailing_list
    !!(convention && policy(MailingListsPresenter.new(convention)).read_any_mailing_list?)
  end

  field :can_read_reports, Boolean, null: false

  def can_read_reports
    !!(convention && convention_policy.view_reports?)
  end

  field :can_manage_forms, Boolean, null: false

  def can_manage_forms
    !!(convention && policy(Form.new(convention: convention)).manage?)
  end

  field :can_manage_oauth_applications, Boolean, null: false

  def can_manage_oauth_applications
    policy(Doorkeeper::Application.new).manage?
  end

  field :can_manage_runs, Boolean, null: false

  def can_manage_runs
    !!(convention && policy(Run.new(event: Event.new(convention: convention))).manage?)
  end

  field :can_manage_rooms, Boolean, null: false

  def can_manage_rooms
    !!(convention && policy(Room.new(convention: convention)).manage?)
  end

  field :can_manage_signups, Boolean, null: false

  def can_manage_signups
    !!(
      convention &&
      policy(Signup.new(run: Run.new(event: Event.new(convention: convention)))).manage?
    )
  end

  field :can_manage_staff_positions, Boolean, null: false

  def can_manage_staff_positions
    !!(convention && policy(StaffPosition.new(convention: convention)).manage?)
  end

  field :can_manage_ticket_types, Boolean, null: false

  def can_manage_ticket_types
    !!(convention && policy(::TicketType.new(convention: convention)).manage?)
  end

  field :can_read_admin_notes_on_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_read_admin_notes_on_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([
      pundit_user,
      :read_admin_notes,
      args[:event_proposal_id]
    ])
  end

  field :can_update_admin_notes_on_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_update_admin_notes_on_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([
      pundit_user,
      :update_admin_notes,
      args[:event_proposal_id]
    ])
  end

  field :can_update_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_update_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([pundit_user, :update, args[:event_proposal_id]])
  end

  field :can_delete_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_delete_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([pundit_user, :destroy, args[:event_proposal_id]])
  end

  field :can_update_orders, Boolean, null: false

  def can_update_orders
    policy(Order.new(user_con_profile: UserConProfile.new(convention: convention))).update?
  end

  field :can_create_tickets, Boolean, null: false

  def can_create_tickets
    policy(Ticket.new(user_con_profile: UserConProfile.new(convention: convention))).create?
  end

  field :can_update_ticket, Boolean, null: false do
    argument :ticket_id, Integer, required: true, camelize: false
  end

  def can_update_ticket(**args)
    ModelPermissionLoader.for(Ticket).load([pundit_user, :update, args[:ticket_id]])
  end

  field :can_delete_ticket, Boolean, null: false do
    argument :ticket_id, Integer, required: true, camelize: false
  end

  def can_delete_ticket(**args)
    ModelPermissionLoader.for(Ticket).load([pundit_user, :destroy, args[:ticket_id]])
  end

  field :can_read_organizations, Boolean, null: false

  def can_read_organizations
    policy(Organization.new).read?
  end

  field :can_read_signups, Boolean, null: false

  def can_read_signups
    policy(Signup.new(run: Run.new(event: Event.new(convention: convention)))).read?
  end

  field :can_read_event_signups, Boolean, null: false do
    argument :event_id, Integer, required: true, camelize: false
  end

  def can_read_event_signups(**args)
    event = context[:convention].events.find(args[:event_id])
    policy(Signup.new(run: Run.new(event: event))).read?
  end

  field :can_read_user_activity_alerts, Boolean, null: false

  def can_read_user_activity_alerts
    !!(convention && policy(UserActivityAlert.new(convention: convention)).read?)
  end

  field :can_read_users, Boolean, null: false

  def can_read_users
    policy(User.new).read?
  end

  field :can_update_departments, Boolean, null: false

  def can_update_departments
    policy(Department.new(convention: convention)).update?
  end

  field :can_update_notification_templates, Boolean, null: false

  def can_update_notification_templates
    policy(NotificationTemplate.new(convention: convention)).update?
  end

  field :can_update_signups, Boolean, null: false

  def can_update_signups
    policy(Signup.new(run: Run.new(event: Event.new(convention: convention)))).update?
  end

  field :can_update_products, Boolean, null: false

  def can_update_products
    policy(Product.new(convention: context[:convention])).update?
  end

  field :can_read_user_con_profiles, Boolean, null: false

  def can_read_user_con_profiles
    !!(convention && convention_policy.view_attendees?)
  end

  field :can_create_user_con_profiles, Boolean, null: false

  def can_create_user_con_profiles
    policy(UserConProfile.new(convention: context[:convention])).create?
  end

  field :can_update_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_update_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile)
      .load([pundit_user, :update, args[:user_con_profile_id]])
  end

  field(
    :can_update_privileges_user_con_profile, Boolean,
    null: false,
    deprecation_reason:
      'Privileges have been removed in favor of permissions.  This will always return false.'
  ) do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_update_privileges_user_con_profile(**_args)
    false
  end

  field :can_delete_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_delete_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile)
      .load([pundit_user, :destroy, args[:user_con_profile_id]])
  end

  field :can_become_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_become_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile)
      .load([pundit_user, :become, args[:user_con_profile_id]])
  end

  field :can_withdraw_all_user_con_profile_signups, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_withdraw_all_user_con_profile_signups(**args)
    ModelPermissionLoader.for(UserConProfile)
      .load([pundit_user, :withdraw_all_signups, args[:user_con_profile_id]])
  end

  private

  def convention_policy
    @convention_policy ||= policy(convention)
  end
end
