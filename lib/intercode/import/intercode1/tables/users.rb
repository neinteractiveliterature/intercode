class Intercode::Import::Intercode1::Tables::Users < Intercode::Import::Intercode1::Table
  CONTACT_FIELD_MAP = {
    first_name: :FirstName,
    last_name: :LastName,
    nickname: :Nickname,
    city: :City,
    state: :State,
    zipcode: :Zipcode,
    country: :Country,
    day_phone: :DayPhone,
    evening_phone: :EvePhone,
    best_call_time: :BestTime,
    gender: :Gender,
    preferred_contact: :PreferredContact,
    birth_date: :BirthYear
  }

  PERMISSIONS_MAP = {
    BidChair: %w[
      access_admin_notes
      read_event_proposals
      read_pending_event_proposals
      update_event_proposals
    ],
    BidCom: %w[
      read_event_proposals
    ],
    ConCom: %w[
      read_orders
      read_prerelease_schedule
      read_reports
      read_schedule_with_counts
      read_signup_details
      read_tickets
      read_user_con_profiles
      read_user_con_profile_email
      read_user_con_profile_personal_info
    ],
    GMLiaison: %w[
      access_admin_notes
      override_event_tickets
      read_event_proposals
      read_inactive_events
      read_limited_prerelease_schedule
      read_prerelease_schedule
      read_schedule_with_counts
      update_event_proposals
      update_event_team_members
      update_events
      update_rooms
      update_runs
    ],
    MailToAll: %w[
      read_user_con_profiles_mailing_list
      read_team_members_mailing_list
    ],
    MailToAttendees: %w[
      read_user_con_profiles_mailing_list
    ],
    MailToGMs: %w[
      read_team_members_mailing_list
    ],
    Outreach: %w[
      read_signup_details
    ],
    Scheduling: %w[
      access_admin_notes
      override_event_tickets
      read_event_proposals
      read_inactive_events
      read_limited_prerelease_schedule
      read_pending_event_proposals
      read_prerelease_schedule
      read_schedule_with_counts
      update_event_proposals
      update_events
      update_rooms
      update_runs
    ],
    Staff: Permission.permission_names_for_model_type('Convention')
  }

  PREFERRED_CONTACT_MAP = {
    'EMail' => :email,
    'DayPhone' => :day_phone,
    'EvePhone' => :evening_phone
  }

  attr_reader :user_con_profile_id_map

  def initialize(connection, con, event_id_map, registration_status_map, legacy_password_md5s)
    super connection

    @user_con_profile_id_map = {}
    @con = con
    @event_id_map = event_id_map
    @registration_status_map = registration_status_map
    @legacy_password_md5s = legacy_password_md5s
  end

  def import!
    logger.info "Importing #{object_name.pluralize}"

    dataset.each do |row|
      user = build_user(row, @legacy_password_md5s[row[:UserId]])
      logger.debug "Importing User #{row[:UserId]}"
      user.save!
      id_map[row[:UserId]] = user

      user_con_profile = build_user_con_profile(row, @con, user)
      user_con_profile.save!
      user_con_profile_id_map[row[:UserId]] = user_con_profile

      grant_permissions(row, con, user_con_profile)

      ticket = build_ticket(row, user_con_profile)
      ticket.save! if ticket
    end
  end

  private

  def build_user(row, legacy_password_md5)
    User.find_or_initialize_by(email: row[:EMail].downcase).tap do |user|
      user.blank_password! unless user.encrypted_password.present?

      contact_attrs = contact_attributes(row).slice(:first_name, :last_name)
      contact_attrs.each do |key, value|
        user.send("#{key}=", value) unless user.send(key).present?
      end

      if row[:HashedPassword].present? && !user.legacy_password_md5.present? && !user.encrypted_password.present?
        user.legacy_password_md5 = legacy_password_md5
      end
    end
  end

  def build_user_con_profile(row, con, user)
    # Early Intercode 1 versions didn't enforce email address uniqueness
    existing_profile = con.user_con_profiles.find_by(user_id: user.id)
    return existing_profile if existing_profile

    profile_attrs = {
      convention: con,
      additional_info: additional_info(row)
    }.merge(contact_attributes(row))

    user.user_con_profiles.new(profile_attrs)
  end

  def grant_permissions(row, con, user_con_profile)
    PERMISSIONS_MAP.each do |permission_granting_priv, permissions|
      next unless row[permission_granting_priv]

      staff_position = con.staff_positions.find_or_create_by(name: permission_granting_priv) do |sp|
        sp.visible = false
        sp.save!

        permissions.each do |permission|
          sp.permissions.find_or_create!(convention_id: con.id, permission: permission)
        end
      end

      staff_position.user_con_profiles << user_con_profile
    end
  end

  def contact_attributes(row)
    CONTACT_FIELD_MAP.each_with_object({}) do |(new_field, old_field), attributes|
      old_value = row[old_field]

      attributes[new_field] = case old_field
      when :Gender then old_value.downcase
      when :PreferredContact then PREFERRED_CONTACT_MAP[old_value]
      when :BirthYear then Date.new(old_value, 1, 1) if old_value && old_value > 0
      else old_value
      end
    end.merge(
      address: [row[:Address1], row[:Address2]].map(&:presence).compact.join("\n").presence
    )
  end

  def additional_info(row)
    {
      how_heard: row[:HowHeard]
    }
  end

  def build_ticket(row, user_con_profile)
    ticket_type = @registration_status_map[row[:CanSignup]]
    return unless ticket_type

    provided_by_event = imported_event(row[:CompEventId]) if row[:CompEventId]

    user_con_profile.build_ticket(
      ticket_type: ticket_type,
      provided_by_event: provided_by_event,
      payment_amount_cents: row[:PaymentAmount],
      payment_amount_currency: (row[:PaymentAmount].to_i > 0 ? 'USD' : nil),
      payment_note: row[:PaymentNote]
    )
  end

  def imported_event(old_event_id)
    return unless old_event_id
    @event_id_map[old_event_id]
  end
end
