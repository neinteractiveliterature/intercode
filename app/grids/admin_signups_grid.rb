class AdminSignupsGrid
  include Datagrid
  include Concerns::SignupsGrid

  column(:id, header: "Seq")
  column(:state)
  column(:name, order: "users.last_name, users.first_name") do |signup|
    format(signup.user_con_profile.name_inverted) do |name|
      link_to name, event_run_admin_signup_path(@event, @run, signup)
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
end
