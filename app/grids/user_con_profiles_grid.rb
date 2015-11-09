class UserConProfilesGrid
  include Datagrid
  extend MoneyRails::ActionViewExtension

  scope do
    UserConProfile.includes(:user)
  end

  filter(:name, :string) do |value|
    joins(:user).where("lower(users.last_name) like :value OR lower(users.first_name) like :value", value: "%#{value.downcase}%")
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
  column(:privileges) do |user_con_profile|
    user_con_profile.privileges.map(&:titleize).sort.join(", ")
  end


  # work around bootstrap_form_for's expectation that this be model-like
  def self.validators_on(*attributes)
    []
  end
end