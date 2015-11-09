class Intercode::Import::Intercode1::Tables::Signup < Intercode::Import::Intercode1::Table
  def initialize(connection, con, run_id_map, user_id_map)
    super connection
    @con = con
    @run_id_map = run_id_map
    @user_id_map = user_id_map
  end

  def dataset
    super.where(:State => ['Confirmed', 'Waitlisted'], :Counted => 'Y').order(:TimeStamp)
  end

  private
  def build_record(row)
    run = @run_id_map[row[:RunId]]

    run.signups.new(
      user: @user_id_map[row[:UserId]],
      bucket_key: bucket_key(row, run),
      updated_by: @user_id_map[row[:UserId]]
    )
  end

  # Try to put them in the bucket for their signup gender first; if that fails, try to
  # put them in the neutral bucket.  Failing all else, don't put them in a bucket (i.e.
  # waitlist them).
  def bucket_key(row, run)
    [gender_bucket_key(row), "neutral"].find do |bucket_key|
      run.bucket_has_available_slots?(bucket_key)
    end
  end

  def gender_bucket_key(row)
    case row[:State]
    when 'Confirmed' then row[:Gender].downcase
    when 'Waitlisted' then nil
    end
  end

  def row_id(row)
    row[:SignupId]
  end
end