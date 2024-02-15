# frozen_string_literal: true
class Types::UserConProfileType < Types::BaseObject
  include FormResponseAttrsFields

  # It should be safe to request these fields but they'll return nil if you're not authorized
  def self.personal_info_field(field_name, *args, **kwargs, &block)
    field(field_name, *args, **kwargs, &block)

    define_method field_name do
      return nil unless policy(object).read_personal_info?
      object.public_send(field_name)
    end
  end

  authorize_record

  field :id, ID, null: false
  field :convention, Types::ConventionType, null: false

  field :site_admin, Boolean, null: false
  def site_admin
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :user).load(object).site_admin?
  end

  field :name, String, null: false
  field :name_without_nickname, String, null: false
  field :name_inverted, String, null: false
  field :first_name, String, null: false
  field :last_name, String, null: false
  field :nickname, String, null: true
  field :gravatar_url, String, null: false
  field :gravatar_enabled, Boolean, null: false
  field :bio, String, null: true
  field :can_have_bio, Boolean, null: false, method: :can_have_bio?
  field :bio_name, String, null: true
  field :show_nickname_in_bio, Boolean, null: true
  field :bio_html, String, null: true

  field :current_pending_order, Types::OrderType, null: true do
    description <<~MARKDOWN
    If this profile has a pending order, returns that order. Otherwise, returns null.
  MARKDOWN
  end

  # This is a little bit of a weird thing to expose here; normally we'd just have people query for
  # User, but access to that object is restricted
  field :user_id, ID, null: false

  def bio_html
    dataloader.with(Sources::Markdown, "user_con_profile", "No bio provided", context[:controller]).load(
      [[object, "bio_html"], object.bio, {}]
    )
  end

  def form_response_attrs_json
    attrs_promise = super

    attrs_promise.then do |attrs|
      allowed_attrs = attrs.keys
      allowed_attrs.delete("email") unless policy(object).read_email?
      allowed_attrs.delete("birth_date") unless policy(object).read_birth_date?
      unless policy(object).read_personal_info?
        allowed_attrs.select! { |attr| %w[first_name last_name nickname email birth_date].include?(attr) }
      end

      attrs.slice(*allowed_attrs)
    end
  end

  personal_info_field :user, Types::UserType, null: true
  field :email, String, null: true do
    authorize_action :read_email
  end
  field :staff_positions, [Types::StaffPositionType], null: false

  association_loaders UserConProfile, :convention, :orders, :signups, :signup_requests, :ticket, :user

  def email
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :user).load(object).email
  end

  def gravatar_url
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :user).load(object)
    object.gravatar_url
  end

  def staff_positions
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :staff_positions).load(object)

    # TODO: talk to Dave about this, it will break the bios page as currently coded
    # because the page assumes Con Com is visible
    # if context[:query_from_liquid]
    #   staff_positions.select(&:visible?)
    # else
    #   staff_positions
    # end
  end

  def team_members
    team_members = dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :team_members).load(object)
    team_members.map do |team_member|
      event = dataloader.with(Sources::ActiveRecordAssociation, TeamMember, :event).load(team_member)
      dataloader.with(Sources::ActiveRecordAssociation, Event, :convention).load(event)
    end

    readable_team_members = team_members.select { |team_member| policy(team_member).read? }
    context[:query_from_liquid] ? readable_team_members.select(&:display?) : readable_team_members
  end

  field :birth_date, Types::DateType, null: true
  def birth_date
    return nil unless policy(object).read_birth_date?
    object.birth_date
  end

  personal_info_field :address, String, null: true
  personal_info_field :city, String, null: true
  personal_info_field :state, String, null: true
  personal_info_field :zipcode, String, null: true
  personal_info_field :country, String, null: true
  personal_info_field :mobile_phone, String, null: true
  personal_info_field :accepted_clickwrap_agreement, Boolean, null: true
  personal_info_field :ical_secret, String, null: true

  field :ticket, Types::TicketType, null: true
  field :ability, Types::AbilityType, null: true

  def ability
    object == context[:user_con_profile] ? pundit_user : AuthorizationInfoLoader.for(UserConProfile).load(object)
  end

  field :orders, [Types::OrderType], null: false
  field :order_summary, String, null: false

  def order_summary
    return "" unless policy(Order.new(user_con_profile: object)).read?
    OrderSummaryLoader.for.load(object)
  end

  field :signups, [Types::SignupType], null: false
  field :signup_requests, [Types::SignupRequestType], null: false
  field :team_members, [Types::TeamMemberType], null: false
  field :can_override_maximum_event_provided_tickets, Boolean, null: false

  def can_override_maximum_event_provided_tickets
    user = object == context[:user_con_profile] ? pundit_user : AuthorizationInfo.new(object.user, nil)

    override = context[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
    Pundit.policy(user, override).create?
  end

  private

  # Not exposed as a field, but needed by FormResponseAttrsFields
  def form
    convention.then(&:user_con_profile_form)
  end
end
