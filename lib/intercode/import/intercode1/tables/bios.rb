require 'upmark'

class Intercode::Import::Intercode1::Tables::Bios < Intercode::Import::Intercode1::Table
  def initialize(connection, user_con_profile_id_map)
    super connection
    @user_con_profile_id_map = user_con_profile_id_map
  end

  private
  def build_record(row)
    user_con_profile = UserConProfile.find(@user_con_profile_id_map[row[:UserId]])

    # TODO: import titles somehow
    user_con_profile.assign_attributes(
      bio: markdownify_bio(row[:BioText]),
      show_nickname_in_bio: row[:ShowNickname] != 0
    )

    user_con_profile
  end

  def row_id(row)
    row[:BioId]
  end

  def markdownify_bio(bio)
    return nil unless bio.present?

    begin
      cleaned_bio = Nokogiri::HTML.parse(bio).css('body').first.inner_html
      Upmark.convert(cleaned_bio)
    rescue Exception => e
      logger.warn("Error converting #{cleaned_bio.inspect} to Markdown: #{e.message}")
      bio
    end
  end
end