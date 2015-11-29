class UserConProfilesGrid
  include Datagrid
  extend MoneyRails::ActionViewExtension

  scope do
    UserConProfile.includes(:user, ticket: :ticket_type)
  end

  filter(:name, :string) do |value|
    joins(:user).where("lower(users.last_name) like :value OR lower(users.first_name) like :value", value: "%#{value.downcase}%")
  end

  filter(:email, :string)

  filter(:ticket_type, :enum, select: :ticket_types, checkboxes: true) do |value|
    clauses = value.map do |ticket_type_id|
      if ticket_type_id == 'none'
        where("user_con_profiles.id NOT IN (?)", Ticket.select(:user_con_profile_id))
      else
        joins(:ticket).where(tickets: {ticket_type_id: ticket_type_id})
      end
    end

    where(clauses.map { |clause| "user_con_profiles.id IN (#{clause.select(:id).to_sql})"}.join(" OR "))
  end

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
    status_parts = []

    if user_con_profile.ticket
      status_parts << user_con_profile.ticket.ticket_type.name.humanize
      payment_amount = user_con_profile.ticket.payment_amount

      if payment_amount.try(:>, 0)
        status_parts << humanized_money_with_symbol(payment_amount)
      end
    else
      status_parts << "Unpaid"
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

  def ticket_types
    [["Unpaid", "none"]] + TicketType.where(id: scope.joins(:ticket).select(:ticket_type_id).distinct).pluck(:description, :id)
  end
end