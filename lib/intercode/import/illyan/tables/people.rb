class Intercode::Import::Illyan::Tables::People < Intercode::Import::Illyan::Table
  include Intercode::Import::Illyan::PasswordMigration

  def initialize(illyan_connection, emails)
    @emails = emails
    super(illyan_connection)
  end

  def dataset
    super.where(email: @emails)
  end

  private

  def build_record(row)
    User.find_or_initialize_by(email: row[:email].downcase).tap do |user|
      set_user_name(user, row)
      return nil unless set_user_password_if_required(user, row)
    end
  end

  def set_user_name(user, row)
    user.first_name ||= (row[:firstname] || '')
    user.last_name ||= (row[:lastname] || '')
    user.first_name = user.email if user.name.blank?
  end
end
