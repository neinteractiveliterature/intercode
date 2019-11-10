class Tables::UserConProfilesTableResultsPresenter < Tables::TableResultsPresenter
  include MoneyRails::ActionViewExtension

  attr_reader :convention

  def self.for_convention(convention, pundit_user, *args)
    new(convention, Pundit.policy_scope(pundit_user, convention.user_con_profiles), *args)
  end

  def initialize(convention, *args)
    @convention = convention
    super(*args)
  end

  def fields
    [
      Tables::TableResultsPresenter::Field.new(:id, 'ID'),
      Tables::TableResultsPresenter::Field.new(:user_id, 'User ID'),
      Tables::TableResultsPresenter::Field.new(:name, 'Name'),
      Tables::TableResultsPresenter::Field.new(:first_name, 'First name'),
      Tables::TableResultsPresenter::Field.new(:last_name, 'Last name'),
      Tables::TableResultsPresenter::Field.new(:email, 'Email'),
      Tables::TableResultsPresenter::Field.new(:ticket, convention.ticket_name.humanize),
      Tables::TableResultsPresenter::Field.new(:ticket_type, "#{convention.ticket_name.humanize} type"),
      Tables::TableResultsPresenter::Field.new(:payment_amount, 'Payment amount'),
      Tables::TableResultsPresenter::Field.new(:is_team_member, 'Event team member?'),
      Tables::TableResultsPresenter::Field.new(:attending, 'Attending?'),
      Tables::TableResultsPresenter::Field.new(
        :ticket_updated_at,
        "#{convention.ticket_name.humanize} status changed"
      ),
      Tables::TableResultsPresenter::Field.new(:privileges, 'Privileges'),
      Tables::TableResultsPresenter::Field.new(:order_summary, 'Order summary'),
      *form_fields
    ].uniq(&:id)
  end

  def form_fields
    @form_fields ||= convention.user_con_profile_form.form_items.select(&:identifier).map do |form_item|
      Tables::TableResultsPresenter::Field.new(
        form_item.identifier.to_sym,
        form_item.properties['admin_description'] || form_item.identifier.humanize
      )
    end
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :name
      scope.name_search(value)
    when :first_name
      scope.name_search(value, columns: %w[first_name])
    when :last_name
      scope.name_search(value, columns: %w[last_name])
    when :email
      scope.joins(:user).where('lower(users.email) like :value', value: "%#{value.downcase}%")
    when :attending
      if value
        scope.left_joins(:ticket).where.not(tickets: { id: nil })
      else
        scope.left_joins(:ticket).where(tickets: { id: nil })
      end
    when :is_team_member
      if value
        scope.where(id: TeamMember.select(:user_con_profile_id))
      else
        scope.where.not(id: TeamMember.select(:user_con_profile_id))
      end
    when :payment_amount
      payment_amount_fractional = (value.to_f * 100.0).to_i
      if payment_amount_fractional == 0
        scope.left_joins(:ticket).where('tickets.payment_amount_cents = 0 OR tickets.payment_amount_cents IS NULL')
      else
        scope.left_joins(:ticket).where(tickets: { payment_amount_cents: payment_amount_fractional })
      end
    when :ticket, :ticket_type
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

  def expand_scope_for_sort(scope, sort_field, _direction)
    case sort_field
    when :email
      scope.joins(:user)
    when :ticket, :ticket_type, :ticket_updated_at
      scope.joins(ticket: :ticket_type)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :name
      Arel.sql("lower(user_con_profiles.last_name) #{direction}, \
lower(user_con_profiles.first_name) #{direction}")
    when :first_name
      Arel.sql("lower(user_con_profiles.first_name) #{direction}")
    when :last_name
      Arel.sql("lower(user_con_profiles.last_name) #{direction}")
    when :email
      Arel.sql("lower(users.email) #{direction}")
    when :ticket
      Arel.sql("ticket_types.name #{direction}, tickets.payment_amount_cents #{direction}")
    when :ticket_type
      Arel.sql("ticket_types.name #{direction}")
    when :ticket_updated_at
      Arel.sql("tickets.updated_at #{direction}")
    else
      super
    end
  end

  def apply_privileges_filter(scope, value)
    if value.include?('site_admin')
      scope.joins(:user).where(users: { site_admin: true })
    else
      scope
    end
  end

  def csv_scope
    scoped.includes(:user, :team_members, ticket: :ticket_type, orders: { order_entries: [:product, :product_variant] })
  end

  def generate_csv_cell(field, user_con_profile)
    case field.id
    when :name then user_con_profile.name_inverted
    when :ticket then describe_ticket(user_con_profile.ticket)
    when :ticket_type then describe_ticket(user_con_profile.ticket, include_payment_amount: false)
    when :payment_amount
      if user_con_profile.ticket&.payment_amount_cents
        user_con_profile.ticket.payment_amount_cents / 100.0
      end
    when :attending then user_con_profile.ticket ? 'yes' : 'no'
    when :is_team_member then user_con_profile.team_members.any? ? 'yes' : 'no'
    when :ticket_updated_at then user_con_profile.ticket&.updated_at&.iso8601
    when :privileges then user_con_profile.privileges.map(&:titleize).sort.join(', ')
    when *form_fields.map(&:id).map(&:to_sym)
      user_con_profile.read_form_response_attribute(field.id)
    else user_con_profile.public_send(field.id)
    end
  end

  def describe_ticket(ticket, include_payment_amount: true)
    return 'Unpaid' unless ticket

    status_parts = []
    status_parts << ticket.ticket_type.name.humanize

    if include_payment_amount
      payment_amount = ticket.payment_amount
      status_parts << humanized_money_with_symbol(payment_amount) if payment_amount.try(:>, 0)
    end

    status_parts.compact.join(' ')
  end
end
