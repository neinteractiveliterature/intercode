module Intercode::Import::Illyan::PasswordMigration
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
