# frozen_string_literal: true
class Types::UserConProfileType < Types::BaseObject
  description <<~MARKDOWN
    A UserConProfile is a user's profile in a particular convention web site.  Most convention-level objects are
    attached to the UserConProfile (e.g. signups, event team memberships, staff positions, etc.).
  MARKDOWN

  include FormResponseAttrsFields

  # It should be safe to request these fields but they'll return nil if you're not authorized
  def self.personal_info_field(field_name, ...)
    field(field_name, ...)

    define_method field_name do
      return nil unless policy(object).read_personal_info?
      object.public_send(field_name)
    end
  end

  authorize_record

  field :ability, Types::AbilityType, null: true, description: "This user profile's permission set."
  field :bio, String, null: true, description: "The bio to display for this user profile, in Markdown format."
  field :bio_html, String, null: true, description: "The bio to display for this user profile, rendered as HTML."
  field :bio_name, String, null: true do # rubocop:disable GraphQL/ExtractType
    description "If present, overrides the name to use for this user profile in their bio display."
  end
  field :can_have_bio, Boolean, null: false, method: :can_have_bio? do
    description <<~MARKDOWN
      Is this user allowed to display a bio on the web site (e.g. because they're a convention staff member or an
      event team member)?
    MARKDOWN
  end
  field :can_override_maximum_event_provided_tickets, Boolean, null: false do # rubocop:disable GraphQL/ExtractType
    description "Does this user have permission to override the event-provided ticket thresholds in this convention?"
  end
  field :convention, Types::ConventionType, null: false, description: "The convention this profile is attached to."
  field :current_pending_order, Types::OrderType, null: true do
    description <<~MARKDOWN
      If this profile has a pending order, returns that order. Otherwise, returns null.
    MARKDOWN
  end
  field :email, String, null: true, description: "This user profile's email address." do
    authorize_action :read_email
  end
  field :first_name, String, null: false, description: "This user profile's first name."
  field :gravatar_enabled, Boolean, null: false, description: "Has this user enabled Gravatars for this profile?"
  field :gravatar_url, String, null: false, description: "The URL of this profile's Gravatar." # rubocop:disable GraphQL/ExtractType
  field :id, ID, null: false, description: "The ID of this profile."
  field :last_name, String, null: false, description: "This user profile's last name."
  field :name, String, null: false, description: "This user profile's full name, including their nickname if present."
  field :name_inverted, String, null: false, description: "This user profile's name in Last, First format."
  field :name_without_nickname, String, null: false do # rubocop:disable GraphQL/ExtractType
    description "This user profile's full name, not including their nickname."
  end
  field :nickname, String, null: true, description: "This user profile's nickname."
  field :order_summary, String, null: false, description: "A human-readable summary of all this profile's orders."
  field :orders, [Types::OrderType], null: false, description: "All the orders placed by this profile."
  field :ranked_choice_allow_waitlist, Boolean, null: false do
    description "If this user can't be signed up for any of their ranked choices, should the site waitlist them?"
  end
  field :ranked_choice_user_constraints, [Types::RankedChoiceUserConstraintType], null: false do # rubocop:disable GraphQL/ExtractType
    description "All the constraints this profile has placed on the number of ranked choice signups they want."
  end
  field :show_nickname_in_bio, Boolean, null: true do
    description "Should this profile's bio use the nickname as part of their name?"
  end
  field :signup_constraints, Types::UserSignupConstraintsType, null: false do
    description "The current constraints on signups for this user at this convention."
  end
  field :signup_ranked_choices, [Types::SignupRankedChoiceType], null: false do
    description "This user's ranked choice list for signups."
  end
  field :signup_requests, [Types::SignupRequestType], null: false do # rubocop:disable GraphQL/ExtractType
    description "All the signup requests made by this profile."
  end
  field :signups, [Types::SignupType], null: false do
    description "All the event signups attached to this profile."
  end
  field :site_admin, Boolean, null: false, description: "Does this profile belong to a global site admin?"
  field :staff_positions, [Types::StaffPositionType], null: false do
    description "All the staff positions this profile belongs to."
  end
  field :team_members, [Types::TeamMemberType], null: false do
    description "All the team memberships this profile is in."
  end
  field :ticket, Types::TicketType, null: true do
    description "This profile's convention ticket, if present."
  end
  field :user_id, ID, null: false do
    description <<~MARKDOWN
      The ID of the user account this profile belongs to.

      This is a little bit of a weird thing to expose here; normally we'd just have people query for
      User, but access to that object is restricted.  So if you need the user ID (e.g. to determine whether two profiles
      are the same person) but you don't necessarily have access to the User account, you can use this field.
    MARKDOWN
  end

  personal_info_field :accepted_clickwrap_agreement, Boolean, null: true do
    description "Has this user accepted the clickwrap agreement for this convention (if it has one)?"
  end
  personal_info_field :address, String, null: true do
    description "The street address portion of this profile's mailing address."
  end
  personal_info_field :birth_date, Types::DateType, null: true, description: "This user profile's date of birth."
  personal_info_field :city, String, null: true, description: "The city portion of this profile's mailing address."
  personal_info_field :country, String, null: true do
    description "The country portion of this profile's mailing address."
  end
  personal_info_field :ical_secret, String, null: true do
    description "The randomly-generated secret portion of the URL to use for fetching this profile's personal calendar."
  end
  personal_info_field :mobile_phone, String, null: true, description: "This profile's mobile phone number."
  personal_info_field :state, String, null: true, description: "The state portion of this profile's mailing address."
  personal_info_field :user, Types::UserType, null: true, description: "The user account attached to this profile."
  personal_info_field :zipcode, String, null: true, description: "The ZIP portion of this profile's mailing address."

  def site_admin
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :user).load(object).site_admin?
  end

  association_loaders UserConProfile,
                      :convention,
                      :orders,
                      :ranked_choice_user_constraints,
                      :signups,
                      :signup_ranked_choices,
                      :signup_requests,
                      :ticket,
                      :user

  def bio_html
    dataloader.with(Sources::Markdown, "user_con_profile", "No bio provided", context[:controller]).load(
      [[object, "bio_html"], object.bio, {}]
    )
  end

  def form_response_attrs_json
    attrs = super

    allowed_attrs = attrs.keys
    allowed_attrs.delete("email") unless policy(object).read_email?
    allowed_attrs.delete("birth_date") unless policy(object).read_birth_date?
    unless policy(object).read_personal_info?
      allowed_attrs.select! { |attr| %w[first_name last_name nickname email birth_date].include?(attr) }
    end

    attrs.slice(*allowed_attrs)
  end

  def email
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :user).load(object).email
  end

  def gravatar_url
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :user).load(object)
    object.gravatar_url
  end

  def signup_constraints
    UserSignupConstraints.new(object)
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

  def birth_date
    return nil unless policy(object).read_birth_date?
    object.birth_date
  end

  def ability
    object == context[:user_con_profile] ? pundit_user : dataloader.with(AuthorizationInfo, UserConProfile).load(object)
  end

  def order_summary
    return "" unless policy(Order.new(user_con_profile: object)).read?
    dataloader.with(Sources::OrderSummary).load(object)
  end

  def can_override_maximum_event_provided_tickets
    user = object == context[:user_con_profile] ? pundit_user : AuthorizationInfo.new(object.user, nil)

    override = context[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
    Pundit.policy(user, override).create?
  end

  private

  # Not exposed as a field, but needed by FormResponseAttrsFields
  def form
    convention.user_con_profile_form
  end
end
