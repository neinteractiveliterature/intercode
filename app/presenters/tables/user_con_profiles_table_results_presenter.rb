class Tables::UserConProfilesTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, current_ability, *args)
    new(convention, convention.user_con_profiles.accessible_by(current_ability), *args)
  end

  attr_reader :convention

  def initialize(convention, *args)
    @convention = convention
    super(*args)
  end

  def fields
    [
      Tables::TableResultsPresenter::Field.new(:name, 'Name'),
      Tables::TableResultsPresenter::Field.new(:email, 'Email'),
      Tables::TableResultsPresenter::Field.new(:ticket, convention.ticket_name.humanize),
      Tables::TableResultsPresenter::Field.new(
        :ticket_status_changed_at,
        "#{convention.ticket_name.humanize} status change"
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
    when :email
      scope.joins(:user).where('lower(users.email) like :value', value: "%#{value.downcase}%")
    when :ticket_type_id
      scope.joins(:ticket).where(tickets: { ticket_type_id: value })
    else
      scope
    end
  end

  def expand_scope_for_sort(scope, sort_field)
    case sort_field
    when :email
      scope.joins(:user)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :name
      "last_name #{direction}, first_name #{direction}"
    when :email
      "users.email #{direction}"
    else
      super
    end
  end
#
#   def csv_scope
#     scoped.includes(user_con_profile: :user)
#   end
#
#   def generate_csv_cell(field, signup)
#     case field.id
#     when :name then signup.user_con_profile.name_inverted
#     when :bucket then describe_bucket(signup)
#     when :age then signup.user_con_profile.age_as_of(signup.run.starts_at)
#     when :email then signup.user_con_profile.email
#     else signup.public_send(field.id)
#     end
#   end
#
#   def describe_bucket(signup)
#     bucket = signup.bucket
#     requested_bucket = signup.requested_bucket
#
#     return bucket.name if bucket && requested_bucket && bucket.name == requested_bucket.name
#     return "#{bucket&.name || 'None'} (requested #{requested_bucket.name})" if requested_bucket
#     return "#{bucket.name} (no preference)" if bucket
#
#     ''
#   end
end
