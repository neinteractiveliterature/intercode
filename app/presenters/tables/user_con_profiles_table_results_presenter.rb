class Tables::UserConProfilesTableResultsPresenter < Tables::TableResultsPresenter
  extend MoneyRails::ActionViewExtension

  attr_reader :convention

  def self.for_convention(convention, pundit_user, *args)
    new(convention, Pundit.policy_scope(pundit_user, convention.user_con_profiles), *args)
  end

  def self.filter_ticket_type(scope, value)
    ticket_type_ids = value.map do |id_value|
      if id_value == 'none'
        nil
      else
        id_value.to_i
      end
    end

    scope.left_joins(:ticket).where(tickets: { ticket_type_id: ticket_type_ids })
  end

  def self.describe_ticket(ticket, include_payment_amount: true)
    return 'Unpaid' unless ticket

    status_parts = []
    status_parts << ticket.ticket_type.name.humanize

    if include_payment_amount
      payment_amount = ticket.payment_amount
      status_parts << humanized_money_with_symbol(payment_amount) if payment_amount.try(:>, 0)
    end

    status_parts.compact.join(' ')
  end

  field :id, 'ID'
  field :user_id, 'User ID'

  field :name, 'Name' do
    def apply_filter(scope, value)
      scope.name_search(value)
    end

    def sql_order(direction)
      Arel.sql("lower(user_con_profiles.last_name) #{direction}, \
lower(user_con_profiles.first_name) #{direction}")
    end

    def generate_csv_cell(user_con_profile)
      user_con_profile.name_inverted
    end
  end

  field :first_name, 'First name' do
    def apply_filter(scope, value)
      scope.name_search(value, columns: %w[first_name])
    end

    def sql_order(direction)
      Arel.sql("lower(user_con_profiles.first_name) #{direction}")
    end
  end

  field :last_name, 'Last name' do
    def apply_filter(scope, value)
      scope.name_search(value, columns: %w[last_name])
    end

    def sql_order(direction)
      Arel.sql("lower(user_con_profiles.last_name) #{direction}")
    end
  end

  field :email, 'Email' do
    def apply_filter(scope, value)
      scope.joins(:user).where('lower(users.email) like :value', value: "%#{value.downcase}%")
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:user)
    end

    def sql_order(direction)
      Arel.sql("lower(users.email) #{direction}")
    end
  end

  field :ticket, nil do
    def csv_header
      presenter.convention.ticket_name.humanize
    end

    def apply_filter(scope, value)
      Tables::UserConProfilesTableResultsPresenter.filter_ticket_type(scope, value)
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(ticket: :ticket_type)
    end

    def sql_order(direction)
      Arel.sql("ticket_types.name #{direction}, tickets.payment_amount_cents #{direction}")
    end

    def generate_csv_cell(user_con_profile)
      Tables::UserConProfilesTableResultsPresenter.describe_ticket(user_con_profile.ticket)
    end
  end

  field :ticket_type, nil do
    def csv_header
      "#{presenter.convention.ticket_name.humanize} type"
    end

    def apply_filter(scope, value)
      Tables::UserConProfilesTableResultsPresenter.filter_ticket_type(scope, value)
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(ticket: :ticket_type)
    end

    def sql_order(direction)
      Arel.sql("ticket_types.name #{direction}")
    end

    def generate_csv_cell(user_con_profile)
      Tables::UserConProfilesTableResultsPresenter.describe_ticket(
        user_con_profile.ticket, include_payment_amount: false
      )
    end
  end

  field :payment_amount, 'Payment amount' do
    def apply_filter(scope, value)
      payment_amount_fractional = (value.to_f * 100.0).to_i
      if payment_amount_fractional == 0
        scope.left_joins(:ticket).where(
          'tickets.payment_amount_cents = 0 OR tickets.payment_amount_cents IS NULL'
        )
      else
        scope.left_joins(:ticket).where(
          tickets: { payment_amount_cents: payment_amount_fractional }
        )
      end
    end

    def generate_csv_cell(user_con_profile)
      return nil unless user_con_profile.ticket&.payment_amount_cents
      user_con_profile.ticket.payment_amount_cents / 100.0
    end
  end

  field :is_team_member, 'Event team member?' do
    def apply_filter(scope, value)
      if value
        scope.where(id: TeamMember.for_active_events.select(:user_con_profile_id))
      else
        scope.where.not(id: TeamMember.for_active_events.select(:user_con_profile_id))
      end
    end

    def generate_csv_cell(user_con_profile)
      user_con_profile.team_members.for_active_events.any? ? 'yes' : 'no'
    end
  end

  field :attending, 'Attending?' do
    def apply_filter(scope, value)
      if value
        scope.left_joins(:ticket).where.not(tickets: { id: nil })
      else
        scope.left_joins(:ticket).where(tickets: { id: nil })
      end
    end

    def generate_csv_cell(user_con_profile)
      user_con_profile.ticket ? 'yes' : 'no'
    end
  end

  field :ticket_updated_at, nil do
    def csv_header
      "#{presenter.convention.ticket_name.humanize} status changed"
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(ticket: :ticket_type)
    end

    def sql_order(direction)
      Arel.sql("tickets.updated_at #{direction}")
    end

    def generate_csv_cell(user_con_profile)
      user_con_profile.ticket&.updated_at&.iso8601
    end
  end

  field :privileges, 'Privileges' do
    def apply_filter(scope, value)
      if value.include?('site_admin')
        scope.joins(:user).where(users: { site_admin: true })
      else
        scope
      end
    end

    def generate_csv_cell(user_con_profile)
      user_con_profile.privileges.map(&:titleize).sort.join(', ')
    end
  end

  field :order_summary, 'Order summary'

  def initialize(convention, *args)
    @convention = convention
    super(*args)
  end

  def fields
    super.merge(form_fields)
  end

  def form_fields
    @form_fields ||= begin
      usable_form_items = convention.user_con_profile_form.form_items.select(&:identifier)
      usable_form_items.each_with_object({}) do |form_item, form_fields|
        form_fields[form_item.identifier.to_sym] = FormField.new(self, form_item)
      end
    end
  end

  private

  def apply_privileges_filter(scope, value)
    if value.include?('site_admin')
      scope.joins(:user).where(users: { site_admin: true })
    else
      scope
    end
  end

  def csv_scope
    scoped.includes(
      :user,
      :team_members,
      ticket: :ticket_type,
      orders: { order_entries: [:product, :product_variant] }
    )
  end
end
