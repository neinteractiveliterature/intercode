class Tables::SignupsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_run(run, filters, sort)
    scope = run.signups
    new(scope, filters, sort)
  end

  def fields
    [
      Tables::TableResultsPresenter::Field.new(:id, 'Seq'),
      Tables::TableResultsPresenter::Field.new(:state, 'State'),
      Tables::TableResultsPresenter::Field.new(:name, 'Name'),
      Tables::TableResultsPresenter::Field.new(:bucket, 'Bucket'),
      Tables::TableResultsPresenter::Field.new(:age, 'Age'),
      Tables::TableResultsPresenter::Field.new(:email, 'Email')
    ]
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :name
      scope.joins(:user_con_profile)
        .where(
          "lower(user_con_profiles.last_name) like :value \
OR lower(user_con_profiles.first_name) like :value",
          value: "%#{value.downcase}%"
        )
    when :email
      scope.joins(user_con_profile: :user)
        .where('lower(users.email) like :value', value: "%#{value.downcase}%")
    when :state
      value.present? ? scope.where(state: value) : scope
    when :bucket
      value.present? ? scope.where(bucket_key: value) : scope
    else
      scope
    end
  end

  def expand_scope_for_sort(scope, sort_field)
    case sort_field
    when :name, :email, :age
      scope.joins(:user_con_profile)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :name
      "user_con_profiles.last_name #{direction}, user_con_profiles.first_name #{direction}"
    when :email
      "user_con_profiles.email #{direction}"
    when :age
      "user_con_profiles.birth_date #{invert_sort_direction direction}"
    when :bucket
      "bucket_key #{direction}"
    else
      super
    end
  end

#   def csv_scope
#     scoped.includes(:user_con_profile)
#   end
#
#   def generate_csv_cell(field, order)
#     case field.id
#     when :user_name then order.user_con_profile.name_without_nickname
#     when :describe_products then order.order_entries.map(&:describe_products).join(', ')
#     when :total_price then order.total_price.format
#     else order.public_send(field.id)
#     end
#   end
end
