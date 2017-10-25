class SignupSpyGrid
  include Datagrid
  include Concerns::SignupsGrid

  column(:name, order: "users.last_name, users.first_name") do |signup|
    signup.user_con_profile.name_inverted
  end
  column(:event, order: 'events.title, runs.id') do |signup|
    "#{signup.event.title}#{signup.run.title_suffix.present? ? " (#{signup.run.title_suffix})" : ''}, #{signup.run.starts_at.strftime('%A %l:%M%P')}"
  end
  column(:state)
  column(:timestamp, order: 'signups.created_at desc') do |signup|
    signup.created_at.strftime('%Y-%m-%d %H:%M:%S.%L')
  end
  column(:choice) do |signup|
    if signup.counted?
      signup.user_con_profile.signups.select(&:counted?).sort_by(&:created_at).index(signup) + 1
    else
      "N/C"
    end
  end

  bucket_column

  def row_class(signup)
    case signup.state
    when 'confirmed' then 'table-success'
    when 'waitlisted' then 'table-warning'
    when 'withdrawn' then 'table-danger'
    end
  end
end
