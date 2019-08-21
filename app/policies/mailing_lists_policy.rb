class MailingListsPolicy < ApplicationPolicy
  delegate :convention, to: :record

  def read_any_mailing_list?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        has_convention_permission?(convention,
          :read_team_members_mailing_list, :read_user_con_profiles_mailing_list
        )
      end
    end

    read?
  end

  def read_team_members_mailing_list?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        has_convention_permission?(convention, :read_team_members_mailing_list)
      end
    end

    read?
  end

  def read_user_con_profiles_mailing_list?
    return true if oauth_scoped_disjunction do |d|
      d.add(:read_conventions) do
        has_convention_permission?(convention, :read_user_con_profiles_mailing_list)
      end
    end

    read?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
