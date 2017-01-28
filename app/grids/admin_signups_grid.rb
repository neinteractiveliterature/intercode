class AdminSignupsGrid
  include Datagrid

  scope do
    Signup.includes(:user, run: :event)
  end

  column(:id, header: "Seq")
  column(:state)
  column(:name, order: "users.last_name, users.first_name") do |signup|
    format(signup.user_con_profile.name_inverted) do |name|
      link_to name, event_run_admin_signup_path(@event, @run, signup)
    end
  end
  column(:bucket, order: 'signups.bucket_key') do |signup|
    if signup.counted?
      bucket_name = signup.bucket.try!(:name)
      requested_bucket_name = signup.requested_bucket.try!(:name)

      if bucket_name == requested_bucket_name
        bucket_name
      elsif requested_bucket_name
        "#{bucket_name || "None"} (requested #{requested_bucket_name})"
      else
        nil
      end
    else
      "Not counted"
    end
  end
  column(:age, order: "users.birth_date") do |signup|
    signup.user_con_profile.age_as_of signup.run.starts_at
  end
  column(:email, order: "users.email") do |signup|
    format(signup.user.email) do |email|
      intercode_mail_to email
    end
  end
end