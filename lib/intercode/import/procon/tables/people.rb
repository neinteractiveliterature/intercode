require 'intercode/import/illyan/password_migration'

class Intercode::Import::Procon::Tables::People < Intercode::Import::Procon::Table
  include Intercode::Import::Illyan::PasswordMigration

  def initialize(procon_connection, illyan_connection)
    super(procon_connection)
    @illyan_connection = illyan_connection
  end

  private

  def build_record(row)
    User.find_or_initialize_by(email: row[:email].downcase).tap do |user|
      illyan_row = find_illyan_row(row)
      if !illyan_row && !user_has_password?(user)
        logger.warn("Skipping #{row[:email]} due to no matching Illyan record and no password")
        return nil
      end

      set_user_name(user, row)
      return nil unless set_user_password_if_required(user, illyan_row)
    end
  end

  def find_illyan_row(row)
    @illyan_connection[:people].where(email: row[:email].downcase).first
  end

  def set_user_name(user, row)
    user.first_name ||= (row[:firstname] || '')
    user.last_name ||= (row[:lastname] || '')
    user.first_name = user.email if user.name.blank?
  end
end
