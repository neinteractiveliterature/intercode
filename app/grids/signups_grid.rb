class SignupsGrid
  include Datagrid

  scope do
    Signup.includes(:user, run: :event)
  end

  column(:id, header: "Seq")
  column(:status) do |signup|
    if signup.bucket
      "Confirmed"
    else
      "Waitlisted"
    end
  end
  column(:name, order: "users.last_name, users.first_name") do |signup|
    format(signup.user.name_inverted) do |name|
      link_to name, [@event, @run, signup]
    end
  end
  column(:bucket) do |signup|
    signup.bucket.try(:name)
  end
  column(:age, order: "users.birth_date") do |signup|
    signup.user.age_as_of signup.run.starts_at
  end
  column(:email, order: "users.email") do |signup|
    format(signup.user.email) do |email|
      intercode_mail_to email
    end
  end
end