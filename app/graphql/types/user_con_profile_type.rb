class Types::UserConProfileType < Types::BaseObject
  # It should be safe to request these fields but they'll return nil if you're not authorized
  def self.personal_info_field(field_name, *args, **kwargs, &block)
    field(field_name, *args, **kwargs, &block)

    define_method field_name do
      return nil unless policy(object).read_personal_info?
      object.public_send(field_name)
    end
  end

  authorize_record

  field :id, Integer, null: false
  field :convention, Types::ConventionType, null: true
  field :privileges, [String, null: true],
    null: true,
    deprecation_reason: 'Privileges are deprecated in favor of permissions and staff positions'

  def privileges
    AssociationLoader.for(UserConProfile, :user).load(object).then(&:privileges)
  end
  field :name, String, null: true
  field :name_without_nickname, String, null: true
  field :name_inverted, String, null: true
  field :first_name, String, null: true
  field :last_name, String, null: true
  field :nickname, String, null: true
  field :gravatar_url, String, null: false
  field :gravatar_enabled, Boolean, null: false
  field :bio, String, null: true
  field :can_have_bio, Boolean, null: false, method: :can_have_bio?
  field :bio_name, String, null: true
  field :show_nickname_in_bio, Boolean, null: true
  field :bio_html, String, null: true

  # This is a little bit of a weird thing to expose here; normally we'd just have people query for
  # User, but access to that object is restricted
  field :user_id, Integer, null: false

  def bio_html
    MarkdownLoader.for('user_con_profile', 'No bio provided')
      .load([[object, 'bio_html'], object.bio])
  end

  field :form_response_attrs_json, String, null: true

  def form_response_attrs_json
    attrs = FormResponsePresenter.new(context[:convention].user_con_profile_form, object).as_json

    allowed_attrs = attrs.keys
    allowed_attrs.delete('email') unless policy(object).read_email?
    allowed_attrs.delete('birth_date') unless policy(object).read_birth_date?
    unless policy(object).read_personal_info?
      allowed_attrs.select! do |attr|
        %w[first_name last_name nickname email birth_date].include?(attr)
      end
    end

    attrs.slice(*allowed_attrs).to_json
  end

  personal_info_field :user, Types::UserType, null: true
  field :email, String, null: true do
    authorize_action :read_email
  end
  field :staff_positions, [Types::StaffPositionType], null: false

  association_loaders UserConProfile,
    :convention,
    :orders,
    :signups,
    :signup_requests,
    :staff_positions,
    :ticket,
    :user

  def email
    AssociationLoader.for(UserConProfile, :user).load(object).then(&:email)
  end

  def team_members
    AssociationLoader.for(UserConProfile, :team_members).load(object).then do |team_members|
      team_members.select { |team_member| policy(team_member).read? }
    end
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
  personal_info_field :day_phone, String, null: true
  personal_info_field :evening_phone, String, null: true
  personal_info_field :best_call_time, String, null: true
  personal_info_field :preferred_contact, String, null: true
  personal_info_field :accepted_clickwrap_agreement, Boolean, null: true

  field :ticket, Types::TicketType, null: true
  field :ability, Types::AbilityType, null: true

  def ability
    if object == context[:user_con_profile]
      pundit_user
    else
      AuthorizationInfoLoader.for(UserConProfile).load(object)
    end
  end

  field :orders, [Types::OrderType, null: true], null: false
  field :order_summary, String, null: false

  def order_summary
    return '' unless policy(Order.new(user_con_profile: object)).read?
    OrderSummaryLoader.for.load(object)
  end

  field :signups, [Types::SignupType], null: false
  field :signup_requests, [Types::SignupRequestType], null: false
  field :team_members, [Types::TeamMemberType], null: false
  field :can_override_maximum_event_provided_tickets, Boolean, null: false

  def can_override_maximum_event_provided_tickets
    user = if object == context[:user_con_profile]
      pundit_user
    else
      AuthorizationInfo.new(object.user, nil)
    end

    override = context[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
    Pundit.policy(user, override).create?
  end
end
