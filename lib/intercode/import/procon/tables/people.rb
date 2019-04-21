class Intercode::Import::Procon::Tables::People < Intercode::Import::Procon::Table
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

  def set_user_password_if_required(user, illyan_row)
    if user_has_password?(user)
      true
    else
      set_user_password(user, illyan_row)
    end
  end

  def set_user_password(user, illyan_row)
    if illyan_row[:encrypted_password].present?
      user.encrypted_password = illyan_row[:encrypted_password]
    elsif illyan_row[:legacy_password_sha1].present?
      user.legacy_password_sha1 = BCrypt::Password.create(illyan_row[:legacy_password_sha1])
      user.legacy_password_sha1_salt = illyan_row[:legacy_password_sha1_salt]
    elsif illyan_row[:legacy_password_md5].present?
      user.legacy_password_md5 = BCrypt::Password.create(illyan_row[:legacy_password_md5])
    else
      return false
    end

    user.blank_password! # skip checking password since we're setting the encrypted fields directly

    true
  end

  def user_has_password?(user)
    (
      user.encrypted_password.present? ||
      user.legacy_password_md5.present? ||
      user.legacy_password_sha1.present?
    )
  end
end
