module Devise
  module Models
    module LegacySha1Authenticatable
    end
  end

  module Strategies
    class LegacySha1Authenticatable < Devise::Strategies::Base
      def valid?
        params[scope] && params[scope]['email'] && params[scope]['password']
      end

      def authenticate!
        p = mapping.to.find_for_authentication(email: params[scope]['email'])

        if p.nil? || p.legacy_password_sha1.blank?
          pass
        else
          bcrypted_legacy_password = BCrypt::Password.new(p.legacy_password_sha1)
          sha1_digest = Devise::Encryptable::Encryptors::Sha1.digest(
            params[scope]['password'],
            10,
            p.legacy_password_sha1_salt,
            mapping.to.pepper
          )

          if bcrypted_legacy_password == sha1_digest
            # save password as non-legacy version for next time
            p.password = params[scope]['password']
            p.legacy_password_sha1 = nil
            p.legacy_password_sha1_salt = nil
            unless p.save
              Rails.logger.warn "Couldn't save non-legacy password for #{p.name}: \
#{p.errors.full_messages.join(', ')}"
            end

            success!(p)
          else
            pass
          end
        end
      end
    end
  end
end

Warden::Strategies.add(:legacy_sha1_authenticatable, Devise::Strategies::LegacySha1Authenticatable)
Devise.add_module(:legacy_sha1_authenticatable, strategy: true)
