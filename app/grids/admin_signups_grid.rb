class AdminSignupsGrid
  include Datagrid
  include Concerns::SignupsGrid

  filter(:state, :enum, select: Signup::STATES, checkboxes: true)
  filter(:bucket_key, :enum, select: :bucket_keys, checkboxes: true)
  filter(:requested_bucket_key, :enum, select: :bucket_keys, checkboxes: true)

  column(:id, header: "Seq")
  column(:state)
  column(:name, order: "users.last_name, users.first_name") do |signup|
    format(signup.user_con_profile.name_inverted) do |name|
      if can?(:update, signup)
        link_to name, event_run_admin_signup_path(@event, @run, signup)
      else
        name
      end
    end
  end

  bucket_column

  column(:age, order: "users.birth_date") do |signup|
    signup.user_con_profile.age_as_of signup.run.starts_at
  end
  column(:email, order: "users.email") do |signup|
    format(signup.user.email) do |email|
      intercode_mail_to email
    end
  end

  def registration_policy
    @registration_policy ||= Run.find(scope.where_values_hash['run_id']).event.registration_policy
  end

  def bucket_keys
    @bucket_keys ||= registration_policy.buckets.map(&:key)
  end
end
