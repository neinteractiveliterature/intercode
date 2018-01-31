class Intercode::Import::Intercode1::Tables::Signup < Intercode::Import::Intercode1::Table
  STATE_MAP = {
    'Confirmed' => 'confirmed',
    'Waitlisted' => 'waitlisted',
    'Withdrawn' => 'withdrawn'
  }

  def initialize(connection, con, run_id_map, user_id_map, user_con_profile_id_map)
    super connection
    @con = con
    @run_id_map = run_id_map
    @user_id_map = user_id_map
    @user_con_profile_id_map = user_con_profile_id_map
  end

  def dataset
    super.order(:TimeStamp)
  end

  private

  def build_record(row)
    run = @run_id_map[row[:RunId]]
    return unless run

    counted = (row[:Counted] == 'Y')
    row_bucket_key = (counted ? bucket_key(row, run) : nil)
    requested_bucket_key = (counted ? row[:Gender].downcase : nil)
    requested_bucket_key = anything_bucket_key(run) if requested_bucket_key && !run.registration_policy.bucket_with_key(requested_bucket_key)

    run.signups.new(
      user_con_profile: @user_con_profile_id_map[row[:UserId]],
      bucket_key: row_bucket_key,
      requested_bucket_key: requested_bucket_key,
      state: STATE_MAP[row[:State]],
      counted: counted,
      updated_by: @user_id_map[row[:UserId]]
    )
  end

  # Try to put them in the bucket for their signup gender first; if that fails, try to
  # put them in the anything bucket.  Failing all else, don't put them in a bucket (i.e.
  # waitlist them).
  def bucket_key(row, run)
    return unless row[:Counted] == 'Y'
    return unless row[:State] == 'Confirmed'

    [gender_bucket_key(row, run), anything_bucket_key(run)].find do |bucket_key|
      run.bucket_has_available_slots?(bucket_key)
    end
  end

  def anything_bucket_key(run)
    if run.registration_policy.buckets.size == 1
      run.registration_policy.buckets.first.key
    else
      'flex'
    end
  end

  def gender_bucket_key(row, run)
    case row[:State]
    when 'Confirmed'
      bucket_key = row[:Gender].downcase
      if run.registration_policy.bucket_with_key(bucket_key)
        bucket_key
      else
        anything_bucket_key(run)
      end
    when 'Waitlisted' then nil
    end
  end

  def row_id(row)
    row[:SignupId]
  end
end
