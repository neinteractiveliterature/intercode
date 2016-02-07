class Intercode::Import::Intercode1::Tables::GMs < Intercode::Import::Intercode1::Table
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

    # Ugh.  Unfortunately, Intercode 1 makes it possible to have the same user as a GM twice.
    # Intercode 2 doesn't allow it, so if it happens, merge the two records' flags.
    event.team_members.find_or_initialize_by(user_con_profile_id: @user_con_profile_id_map[row[:UserId]].id).tap do |team_member|
      team_member.assign_attributes(
        display: team_member.display || yn_to_bool(row[:DisplayAsGM]),
        show_email: team_member.show_email || yn_to_bool(row[:DisplayEMail]),
        receive_con_email: team_member.receive_con_email || yn_to_bool(row[:ReceiveConEMail]),
        receive_signup_email: team_member.receive_signup_email || yn_to_bool(row[:ReceiveSignupEMail]),
        updated_by: @user_id_map[row[:UpdatedById]]
      )
    end
  end

  def row_id(row)
    row[:GMId]
  end
end