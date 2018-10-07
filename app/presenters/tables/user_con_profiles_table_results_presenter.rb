class Tables::UserConProfilesTableResultsPresenter < Tables::TableResultsPresenter
  include MoneyRails::ActionViewExtension

  attr_reader :convention

  def self.for_convention(convention, current_ability, *args)
    new(convention, convention.user_con_profiles.accessible_by(current_ability), *args)
  end

  def initialize(convention, *args)
    @convention = convention
    super(*args)
  end

  def fields
    [
      Tables::TableResultsPresenter::Field.new(:name, 'Name'),
      Tables::TableResultsPresenter::Field.new(:first_name, 'First name'),
      Tables::TableResultsPresenter::Field.new(:last_name, 'Last name'),
      Tables::TableResultsPresenter::Field.new(:email, 'Email'),
      Tables::TableResultsPresenter::Field.new(:attending, 'Attending?'),
      Tables::TableResultsPresenter::Field.new(:ticket, convention.ticket_name.humanize),
      Tables::TableResultsPresenter::Field.new(
        :ticket_updated_at,
        "#{convention.ticket_name.humanize} status changed"
      ),
      Tables::TableResultsPresenter::Field.new(:privileges, 'Privileges')
    ]
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :name
      scope.where(
        "lower(user_con_profiles.last_name) like :value \
OR lower(user_con_profiles.first_name) like :value",
        value: "%#{value.downcase}%"
      )
    when :first_name
      scope.where(
        'lower(user_con_profiles.first_name) like :value',
        value: "%#{value.downcase}%"
      )
    when :last_name
      scope.where(
        'lower(user_con_profiles.last_name) like :value',
        value: "%#{value.downcase}%"
      )
    when :email
      scope.joins(:user).where('lower(users.email) like :value', value: "%#{value.downcase}%")
    when :attending
      if value
        scope.left_joins(:ticket).where.not(tickets: { id: nil })
      else
        scope.left_joins(:ticket).where(tickets: { id: nil })
      end
    when :ticket
      ticket_type_ids = value.map do |id_value|
        if id_value == 'none'
          nil
        else
          id_value.to_i
        end
      end

      scope.left_joins(:ticket).where(tickets: { ticket_type_id: ticket_type_ids })
    when :privileges
      apply_privileges_filter(scope, value)
    else
      scope
    end
  end

  def expand_scope_for_sort(scope, sort_field)
    case sort_field
    when :email
      scope.joins(:user)
    when :ticket
      scope.joins(ticket: :ticket_type)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :name
      "lower(last_name) #{direction}, lower(first_name) #{direction}"
    when :first_name
      "lower(first_name) #{direction}"
    when :last_name
      "lower(last_name) #{direction}"
    when :email
      "lower(users.email) #{direction}"
    when :ticket
      "ticket_types.name #{direction}, tickets.payment_amount_cents #{direction}"
    when :ticket_updated_at
    when :privileges
      clauses = UserConProfile::PRIV_NAMES.map do |priv_name|
        "#{priv_name} #{invert_sort_direction direction}"
      end

      clauses.join(', ')
    else
      super
    end
  end

  def apply_privileges_filter(scope, value)
    user_con_profile_privileges = value.select { |priv| UserConProfile::PRIV_NAMES.include?(priv) }

    if user_con_profile_privileges.any?
      priv_scopes = user_con_profile_privileges.map do |priv|
        UserConProfile.joins(:user).where(priv => true)
      end
      if value.include?('site_admin')
        priv_scopes << UserConProfile.joins(:user).where(users: { site_admin: true })
      end
      complete_clause = priv_scopes.reduce do |working_scope, priv_scope|
        working_scope.or(priv_scope)
      end
      scope.where(id: complete_clause.select(:id))
    elsif value.include?('site_admin')
      scope.joins(:user).where(users: { site_admin: true })
    else
      scope
    end
  end

  def csv_scope
    scoped.includes(:user, ticket: :ticket_type)
  end

  def generate_csv_cell(field, user_con_profile)
    case field.id
    when :name then user_con_profile.name_inverted
    when :ticket then describe_ticket(user_con_profile.ticket)
    when :attending then user_con_profile.ticket ? 'yes' : 'no'
    when :ticket_updated_at then user_con_profile.ticket&.updated_at&.iso8601
    when :privileges then user_con_profile.privileges.map(&:titleize).sort.join(', ')
    else user_con_profile.public_send(field.id)
    end
  end

  def describe_ticket(ticket)
    return 'Unpaid' unless ticket

    status_parts = []
    status_parts << ticket.ticket_type.name.humanize

    payment_amount = ticket.payment_amount
    status_parts << humanized_money_with_symbol(payment_amount) if payment_amount.try(:>, 0)

    status_parts.compact.join(' ')
  end
end
