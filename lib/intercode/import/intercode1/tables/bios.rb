class Intercode::Import::Intercode1::Tables::Bios < Intercode::Import::Intercode1::Table
  def initialize(connection, user_con_profile_id_map)
    super connection

    @user_con_profile_id_map = user_con_profile_id_map
    @markdownifier = Intercode::Import::Intercode1::Markdownifier.new(logger)
  end

  private
  def build_record(row)
    user_con_profile = UserConProfile.find(@user_con_profile_id_map[row[:UserId]])

    # TODO: import titles somehow
    user_con_profile.assign_attributes(
      bio: @markdownifier.markdownify(row[:BioText]),
      show_nickname_in_bio: row[:ShowNickname] != 0
    )

    user_con_profile
  end

  def row_id(row)
    row[:BioId]
  end
end