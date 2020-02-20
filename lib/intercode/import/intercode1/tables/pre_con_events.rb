class Intercode::Import::Intercode1::Tables::PreConEvents < Intercode::Import::Intercode1::Table
  def initialize(connection, con, user_con_profile_id_map)
    super connection
    @con = con
    @user_con_profile_id_map = user_con_profile_id_map
    @markdownifier = Intercode::Import::Markdownifier.new(logger)
  end

  def dataset
    super.where(Status: %w[Accepted Dropped])
  end

  private

  def build_record(row)
    @con.events.new(
      title: event_title(row),
      con_mail_destination: 'gms',
      length_seconds: row[:Hours] * 1.hour,
      can_play_concurrently: true,
      description: @markdownifier.markdownify(row[:Description]),
      short_blurb: @markdownifier.markdownify(row[:ShortDescription]),
      category: 'panel',
      status: event_status(row),
      registration_policy: RegistrationPolicy.unlimited,
      bypass_single_event_run_check: true # we won't yet have the run for filler events
    )
  end

  def row_id(row)
    row[:PreConEventId]
  end

  def event_title(row)
    find_unique_title(row[:Title])
  end

  def find_unique_title(title, iteration = 1)
    title_plus_iteration = if iteration == 1
      title
    else
      "#{title} [#{iteration}]"
    end

    return title_plus_iteration if @con.events.where(title: title_plus_iteration).none?
    raise "Too many iterations on title #{title}, giving up" if iteration >= 10

    find_unique_title(title, iteration + 1)
  end

  def event_status(row)
    return 'active' if row[:SpecialEvent]

    case row[:Status]
    when 'Accepted' then 'active'
    when 'Dropped' then 'dropped'
    end
  end
end
