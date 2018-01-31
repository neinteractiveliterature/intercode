class Intercode::Import::Intercode1::Tables::GMs < Intercode::Import::Intercode1::Table
  BOOL_FIELD_MAP = {
    display: :DisplayAsGM,
    show_email: :DisplayEMail,
    receive_con_email: :ReceiveConEMail,
    receive_signup_email: :ReceiveSignupEMail
  }

  def initialize(connection, con, event_id_map, user_id_map, user_con_profile_id_map)
    super connection
    @con = con
    @event_id_map = event_id_map
    @user_id_map = user_id_map
    @user_con_profile_id_map = user_con_profile_id_map
  end

  private

  def build_record(row)
    event = @event_id_map[row[:EventId]]
    return unless event

    user_con_profile = @user_con_profile_id_map[row[:UserId]]
    return unless user_con_profile

    # Ugh.  Unfortunately, Intercode 1 makes it possible to have the same user as a GM twice.
    # Intercode 2 doesn't allow it, so if it happens, merge the two records' flags.
    team_member = event.team_members.find_or_initialize_by(user_con_profile_id: user_con_profile.id)
    BOOL_FIELD_MAP.each do |team_member_field, row_field|
      team_member[team_member_field] ||= row[row_field]
    end

    team_member.updated_by = @user_id_map[row[:UpdatedById]]
    team_member
  end

  def row_id(row)
    row[:GMId]
  end
end
