class Intercode::Import::Intercode1::Tables::GMs < Intercode::Import::Intercode1::Table
  def initialize(connection, con, event_id_map, user_id_map)
    super connection
    @con = con
    @event_id_map = event_id_map
    @user_id_map = user_id_map
  end

  private
  def build_record(row)
    event = @event_id_map[row[:EventId]]

    event.team_members.new(
      user: @user_id_map[row[:UserId]],
      display: yn_to_bool(row[:DisplayAsGM]),
      show_email: yn_to_bool(row[:DisplayEMail]),
      receive_con_email: yn_to_bool(row[:ReceiveConEMail]),
      receive_signup_email: yn_to_bool(row[:ReceiveSignupEMail]),
      updated_by: @user_id_map[row[:UpdatedById]]
    )
  end

  def row_id(row)
    row[:GMId]
  end
end