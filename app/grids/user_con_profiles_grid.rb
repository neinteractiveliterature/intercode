class UserConProfilesGrid
  include Datagrid
  extend MoneyRails::ActionViewExtension

  scope do
    UserConProfile.includes(:user)
  end

  filter(:name, :string) do |value|
    joins(:user).where("lower(users.last_name) like :value OR lower(users.first_name) like :value", value: "%#{value.downcase}%")
  end

  filter(:email, :string)

  filter(
    :registration_status,
    :enum,
    select: UserConProfile::REGISTRATION_STATUSES.map { |status| [status.humanize, status] },
    checkboxes: true
  )

  filter(
    :privileges,
    :enum,
    select: UserConProfile::PRIV_NAMES.map { |priv_name| [priv_name.humanize.titleize, priv_name] },
    checkboxes: true
  ) do |value|
    value.inject(self) do |scope, priv_name|
      scope.where(priv_name => true)
    end
  end

  column(:name, order: "users.last_name, users.first_name") do |user_con_profile|
    format(user_con_profile.user.name_inverted) do |name|
      link_to name, user_con_profile
    end
  end
  column(:email, order: "users.email") do |user_con_profile|
    format(user_con_profile.user.email) do |email|
      intercode_mail_to email
    end
  end
  column(:status) do |user_con_profile|
    status_parts = [user_con_profile.registration_status.humanize]

    if user_con_profile.payment_amount.try(:>, 0)
      status_parts << humanized_money_with_symbol(user_con_profile.payment_amount)
    end

    status_parts.compact.join(" ")
  end
  column(:privileges, class: 'col-md-4') do |user_con_profile|
    user_con_profile.privileges.map(&:titleize).sort.join(", ")
  end


  def self.human_attribute_name(attr)
    attr.to_s.humanize
  end

  # work around bootstrap_form_for's expectation that this be model-like
  def self.validators_on(*attributes)
    []
  end
end