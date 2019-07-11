class MailingListsPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def mail_to_any?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        has_privilege_in_convention?(convention, *UserConProfile::MAIL_PRIV_NAMES)
      end
    end

    read?
  end

  UserConProfile::MAIL_PRIV_NAMES.each do |priv_name|
    define_method "#{priv_name}?" do
      return true if oauth_scoped_disjunction do |d|
        d.add(:read_conventions) { has_privilege_in_convention?(convention, priv_name) }
      end

      read?
    end
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
