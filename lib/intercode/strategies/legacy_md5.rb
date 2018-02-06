require 'bcrypt'
require 'digest/md5'

module Devise
  module Models
    module LegacyMd5Authenticatable
    end
  end

  module Strategies
    class LegacyMD5Authenticatable < Devise::Strategies::Base
      def valid?
        params[scope] && params[scope]['email'] && params[scope]['password']
      end

      def authenticate!
        p = mapping.to.find_for_authentication(email: params[scope]['email'])

        if p.nil? || p.legacy_password_md5.blank?
          pass
        else
          bcrypted_legacy_password = BCrypt::Password.new(p.legacy_password_md5)
          if bcrypted_legacy_password == Digest::MD5.hexdigest(params[scope]['password'])

            # save password as non-legacy version for next time
            p.password = params[scope]['password']
            p.legacy_password_md5 = nil
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

Warden::Strategies.add(:legacy_md5_authenticatable, Devise::Strategies::LegacyMD5Authenticatable)
Devise.add_module(:legacy_md5_authenticatable, strategy: true)
