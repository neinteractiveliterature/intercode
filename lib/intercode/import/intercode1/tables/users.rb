class Intercode::Import::Intercode1::Tables::Users < Intercode::Import::Intercode1::Table
  USER_FIELD_MAP = {
    first_name: :FirstName,
    last_name: :LastName,
    nickname: :Nickname,
    address1: :Address1,
    address2: :Address2,
    city: :City,
    state: :State,
    zipcode: :Zipcode,
    country: :Country,
    day_phone: :DayPhone,
    evening_phone: :EvePhone,
    best_call_time: :BestTime
  }

  PRIV_MAP = {
    bid_committee: "BidCom",
    staff: "Staff",
    bid_chair: "BidChair",
    gm_liaison: "GMLiaison",
    registrar: "Registrar",
    outreach: "Outreach",
    con_com: "ConCom",
    scheduling: "Scheduling",
    mail_to_gms: "MailToGMs",
    mail_to_attendees: "MailToAttendes",
    mail_to_vendors: "MailToVendors",
    mail_to_unpaid: "MailToUnpaid",
    mail_to_alumni: "MailToAlumni"
  }

  PREFERRED_CONTACT_MAP = {
    "EMail" => :email,
    "DayPhone" => :day_phone,
    "EvePhone" => :evening_phone
  }

  def initialize(connection, con, event_id_map)
    super connection
    @con = con
    @event_id_map = event_id_map
  end

  def import!
    logger.info "Importing #{object_name.pluralize}"

    dataset.each do |row|
      user = build_user(row)
      logger.debug "Importing User #{row[:UserId]}"
      user.save!
      id_map[row[:UserId]] = user

      user_con_profile = build_user_con_profile(row, @con, user)
      user_con_profile.save!
    end
  end

  private
  def build_user(row)
    User.find_or_initialize_by(email: row[:EMail].downcase).tap do |user|
      USER_FIELD_MAP.each do |new_field, old_field|
        next if user.send(new_field).present?
        user.send("#{new_field}=", row[old_field])
      end

      user.gender ||= row[:Gender].try(:downcase)
      user.preferred_contact ||= PREFERRED_CONTACT_MAP[row[:PreferredContact]]
      user.blank_password! unless user.encrypted_password.present?
    end
  end

  def build_user_con_profile(row, con, user)
    profile_attrs = {
      convention: con,
      registration_status: row[:CanSignup].try(:underscore),
      comp_event: imported_event(row[:CompEventId]),
      payment_amount_cents: row[:PaymentAmount],
      payment_amount_currency: (row[:PaymentAmount].to_i > 0 ? 'USD' : nil),
      payment_note: row[:PaymentNote]
    }.merge(priv_attributes(row))

    user.user_con_profiles.new(profile_attrs)
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