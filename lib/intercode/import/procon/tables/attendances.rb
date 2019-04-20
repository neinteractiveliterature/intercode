class Intercode::Import::Procon::Tables::Attendances < Intercode::Import::Procon::Table
  include Intercode::Import::Procon::UserHelpers

  after_create_record do |row, signup|
    if row[:is_staff] == 1
      signup.run.event.team_members.find_or_create_by!(
        user_con_profile_id: signup.user_con_profile_id
      ) do |team_member|
        team_member.assign_attributes(
          display: true,
          show_email: false,
          receive_con_email: true,
          receive_signup_email: false
        )
      end
    end
  end

  def initialize(connection, convention_id_map, person_id_map, run_id_map)
    super connection
    @convention_id_map = convention_id_map
    @person_id_map = person_id_map
    @run_id_map = run_id_map
  end

  def dataset
    super.exclude(event_id: @convention_id_map.keys)
  end

  private

  def build_record(row)
    run = @run_id_map[row[:event_id]]
    unless run
      logger.warn "Skipping; can't find event with ID #{row[:event_id]}"
      return nil
    end

    user_con_profile = user_con_profile_for_person_id(row[:person_id], run.event.convention)
    return nil unless user_con_profile

    target_bucket_key = bucket_key(row, run.event.registration_policy)

    run.signups.new(
      user_con_profile: user_con_profile,
      requested_bucket_key: target_bucket_key == 'flex' ? nil : target_bucket_key,
      bucket_key: signup_state(row) == 'confirmed' && row[:counts] == 1 ? target_bucket_key : nil,
      state: signup_state(row),
      counted: row[:counts] == 1
    )
  end

  def bucket_key(row, registration_policy)
    return row[:gender] unless row[:gender] == 'neutral'

    if registration_policy.buckets.size == 1
      registration_policy.buckets.first.key
    else
      'flex'
    end
  end

  def signup_state(row)
    return 'withdrawn' if row[:deleted_at]
    return 'waitlisted' if row[:is_waitlist] == 1
    'confirmed'
  end
end
