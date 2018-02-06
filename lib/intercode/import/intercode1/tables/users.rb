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

  PRIV_MAP = {
    proposal_committee: 'BidCom',
    staff: 'Staff',
    proposal_chair: 'BidChair',
    gm_liaison: 'GMLiaison',
    outreach: 'Outreach',
    con_com: 'ConCom',
    scheduling: 'Scheduling',
    mail_to_gms: 'MailToGMs',
    mail_to_attendees: 'MailToAttendes',
    mail_to_vendors: 'MailToVendors',
    mail_to_unpaid: 'MailToUnpaid',
    mail_to_alumni: 'MailToAlumni'
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

      if row[:HashedPassword].present? && !user.legacy_password_md5.present?
        user.legacy_password_md5 = legacy_password_md5
      end
    end
  end

  def build_user_con_profile(row, con, user)
    profile_attrs = {
      convention: con,
      additional_info: additional_info(row)
    }.merge(priv_attributes(row)).merge(contact_attributes(row))

    user.user_con_profiles.new(profile_attrs)
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

  def priv_attributes(row)
    return {} unless row[:Priv]

    priv_attrs = PRIV_MAP.each_with_object({}) do |(new_priv, old_priv), priv_attributes|
      priv_attributes[new_priv] = row[:Priv].include?(old_priv)
    end

    if row[:Priv].include?('MailToAll')
      UserConProfile::MAIL_PRIV_NAMES.each do |priv_name|
        priv_attrs[priv_name] = true
      end
    end

    priv_attrs
  end

  def imported_event(old_event_id)
    return unless old_event_id
    @event_id_map[old_event_id]
  end
end
