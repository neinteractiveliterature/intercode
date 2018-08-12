class Tables::SignupsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_run(run, filters, sort, visible_field_ids = nil)
    scope = run.signups
    new(scope, filters, sort, visible_field_ids)
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

  def csv_scope
    scoped.includes(user_con_profile: :user)
  end

  def generate_csv_cell(field, signup)
    case field.id
    when :name then signup.user_con_profile.name_inverted
    when :bucket then describe_bucket(signup)
    when :age then signup.user_con_profile.age_as_of(signup.run.starts_at)
    when :email then signup.user_con_profile.email
    else signup.public_send(field.id)
    end
  end

  def describe_bucket(signup)
    bucket = signup.bucket
    requested_bucket = signup.requested_bucket

    return bucket.name if bucket && requested_bucket && bucket.name == requested_bucket.name
    return "#{bucket&.name || 'None'} (requested #{requested_bucket.name})" if requested_bucket
    return "#{bucket.name} (no preference)" if bucket

    ''
  end
end
