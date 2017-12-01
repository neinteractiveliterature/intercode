class Intercode::Import::Intercode1::Tables::Away < Intercode::Import::Intercode1::Table
  include Intercode::Import::Intercode1::DateHelpers

  def initialize(connection, con, user_con_profile_id_map)
    super connection

    @con = con
    @user_con_profile_id_map = user_con_profile_id_map
  end

  def import!
    logger.info "Importing #{object_name.pluralize}"
    user_ids = dataset.where(has_any_away_blocks).distinct.select_map(:UserId)
    user_con_profile_ids = user_ids.map { |user_id| @user_con_profile_id_map[user_id] }
    logger.debug "Users with away blocks: #{user_ids.join(', ')}"

    user_con_profiles = UserConProfile.where(id: user_con_profile_ids)
    user_con_profiles.update_all(receive_whos_free_emails: false)
    logger.info "Opted #{user_con_profiles.count} users out of who's free emails"
  end

  private

  def away_columns
    dataset.columns.select { |column| column.to_s =~ /\A(Thu|Fri|Sat|Sun)(\d\d)\z/ }
  end

  def has_any_away_blocks
    where_clauses = away_columns.map { |away_column| [away_column, 1] }
    Sequel::SQL::BooleanExpression.from_value_pairs(where_clauses, :OR)
  end
end
