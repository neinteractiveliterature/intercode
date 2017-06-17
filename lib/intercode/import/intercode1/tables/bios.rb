class Intercode::Import::Intercode1::Tables::Bios < Intercode::Import::Intercode1::Table
  def initialize(connection, user_con_profile_id_map)
    super connection

    @user_con_profile_id_map = user_con_profile_id_map
    @markdownifier = Intercode::Import::Intercode1::Markdownifier.new(logger)
  end

  private
  def build_record(row)
    user_con_profile = @user_con_profile_id_map[row[:UserId]]

    user_con_profile.assign_attributes(
      bio: compose_bio(row),
      show_nickname_in_bio: row[:ShowNickname] != 0
    )

    user_con_profile
  end

  def row_id(row)
    row[:BioId]
  end

  def compose_bio(row)
    title = row[:Title].presence
    title = "*#{title}*<br>\n" if title

    body = @markdownifier.markdownify(row[:BioText])

    [title, body].compact.join('')
  end
end