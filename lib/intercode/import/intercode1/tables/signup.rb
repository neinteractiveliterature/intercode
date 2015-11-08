class Intercode::Import::Intercode1::Tables::Signup < Intercode::Import::Intercode1::Table
  def initialize(connection, con, run_id_map, user_id_map)
    super connection
    @con = con
    @run_id_map = run_id_map
    @user_id_map = user_id_map
  end

  def dataset
    super.where(:State => ['Confirmed', 'Waitlisted'])
  end

  private
  def build_record(row)
    run = @run_id_map[row[:RunId]]

    run.signups.new(
      user: @user_id_map[row[:UserId]],
      bucket_key: bucket_key(row),
      updated_by: @user_id_map[row[:UserId]]
    )
  end

  def bucket_key(row)
    case row[:State]
    when 'Confirmed' then row[:Gender].downcase
    when 'Waitlisted' then nil
    end
  end

  def row_id(row)
    row[:SignupId]
  end
end