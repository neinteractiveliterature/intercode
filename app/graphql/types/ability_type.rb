class Types::AbilityType < Types::BaseObject
  field :can_override_maximum_event_provided_tickets, Boolean, null: false

  def can_override_maximum_event_provided_tickets
    override = Event.new(convention: context[:convention])
      .maximum_event_provided_tickets_overrides
      .new
    object.can?(:create, override)
  end

  field :can_update_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_update_signup(**args)
    ModelPermissionLoader.for(Signup).load([object, :update, args[:signup_id]])
  end

  field :can_update_counted_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_update_counted_signup(**args)
    ModelPermissionLoader.for(Signup).load([object, :update_counted, args[:signup_id]])
  end

  field :can_force_confirm_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_force_confirm_signup(**args)
    ModelPermissionLoader.for(Signup).load([object, :force_confirm, args[:signup_id]])
  end

  field :can_update_bucket_signup, Boolean, null: false do
    argument :signup_id, Integer, required: true, camelize: false
  end

  def can_update_bucket_signup(**args)
    ModelPermissionLoader.for(Signup).load([object, :update_bucket, args[:signup_id]])
  end

  field :can_update_event, Boolean, null: false do
    argument :event_id, Integer, required: true, camelize: false
  end

  def can_update_event(**args)
    ModelPermissionLoader.for(Event).load([object, :update, args[:event_id]])
  end

  field :can_delete_event, Boolean, null: false do
    argument :event_id, Integer, required: true, camelize: false
  end

  def can_delete_event(**args)
    ModelPermissionLoader.for(Event).load([object, :destroy, args[:event_id]])
  end

  field :can_read_schedule, Boolean, null: false

  def can_read_schedule
    object.can?(:schedule, context[:convention])
  end

  field :can_read_admin_notes_on_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_read_admin_notes_on_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([
      object,
      :read_admin_notes,
      args[:event_proposal_id]
    ])
  end

  field :can_update_admin_notes_on_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_update_admin_notes_on_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([
      object,
      :update_admin_notes,
      args[:event_proposal_id]
    ])
  end

  field :can_update_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_update_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([object, :update, args[:event_proposal_id]])
  end

  field :can_delete_event_proposal, Boolean, null: false do
    argument :event_proposal_id, Integer, required: true, camelize: false
  end

  def can_delete_event_proposal(**args)
    ModelPermissionLoader.for(EventProposal).load([object, :destroy, args[:event_proposal_id]])
  end

  field :can_update_orders, Boolean, null: false

  def can_update_orders
    OrderPolicy.new(
      pundit_user,
      Order.new(user_con_profile: UserConProfile.new(convention: convention))
    ).update?
  end

  field :can_create_tickets, Boolean, null: false

  def can_create_tickets
    object.can?(:create, Ticket.new(user_con_profile: UserConProfile.new(convention: context[:convention])))
  end

  field :can_update_ticket, Boolean, null: false do
    argument :ticket_id, Integer, required: true, camelize: false
  end

  def can_update_ticket(**args)
    ModelPermissionLoader.for(Ticket).load([object, :update, args[:ticket_id]])
  end

  field :can_delete_ticket, Boolean, null: false do
    argument :ticket_id, Integer, required: true, camelize: false
  end

  def can_delete_ticket(**args)
    ModelPermissionLoader.for(Ticket).load([object, :destroy, args[:ticket_id]])
  end

  field :can_read_signups, Boolean, null: false

  def can_read_signups
    object.can?(:read, Signup.new(run: Run.new(event: Event.new(convention: context[:convention]))))
  end

  field :can_read_event_signups, Boolean, null: false do
    argument :event_id, Integer, required: true, camelize: false
  end

  def can_read_event_signups(**args)
    event = context[:convention].events.find(args[:event_id])
    object.can?(:read, Signup.new(run: Run.new(event: event)))
  end

  field :can_update_signups, Boolean, null: false

  def can_update_signups
    object.can?(:update, Signup.new(run: Run.new(event: Event.new(convention: context[:convention]))))
  end

  field :can_update_products, Boolean, null: false

  def can_update_products
    object.can?(:update, Product.new(convention: context[:convention]))
  end

  field :can_create_user_con_profiles, Boolean, null: false

  def can_create_user_con_profiles
    object.can?(:create, UserConProfile.new(convention: context[:convention]))
  end

  field :can_update_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_update_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile).load([object, :update, args[:user_con_profile_id]])
  end

  field :can_update_privileges_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_update_privileges_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile).load([object, :update_privileges, args[:user_con_profile_id]])
  end

  field :can_delete_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_delete_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile).load([object, :destroy, args[:user_con_profile_id]])
  end

  field :can_become_user_con_profile, Boolean, null: false do
    argument :user_con_profile_id, Integer, required: true, camelize: false
  end

  def can_become_user_con_profile(**args)
    ModelPermissionLoader.for(UserConProfile).load([object, :become, args[:user_con_profile_id]])
  end
end
