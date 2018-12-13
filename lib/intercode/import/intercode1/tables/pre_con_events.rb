class Intercode::Import::Intercode1::Tables::PreConEvents < Intercode::Import::Intercode1::Table
  def initialize(connection, con, user_con_profile_id_map)
    super connection
    @con = con
    @user_con_profile_id_map = user_con_profile_id_map
    @markdownifier = Intercode::Import::Intercode1::Markdownifier.new(logger)
  end

  def dataset
    super.where(Status: %w[Accepted Dropped])
  end

  def import!
    logger.info "Importing #{object_name.pluralize}"
    dataset.each do |row|
      logger.debug "Importing #{object_name} #{row_id(row)}"
      record = build_record(row)
      next unless record

      record.save!

      submitter = user_con_profile_id_map[row[:SubmitterId]]
      if submitter
        record.team_members.create!(
          user_con_profile: submitter,
          display: true,
          show_email: false,
          receive_con_email: false
        )
      end

      id_map[row_id(row)] = record
    end
  end

  private

  def build_record(row)
    category = 'panel'

    @con.events.new(
      title: event_title(row),
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

    if @con.pre_con_events.where(title: title_plus_iteration).none?
      return title_plus_iteration
    end

    if iteration < 10
      return find_unique_title(title, iteration + 1)
    else
      raise "Too many iterations on title #{title}, giving up"
    end
  end

  def event_status(row)
    return 'active' if row[:SpecialEvent]

    case row[:Status]
    when 'Accepted' then 'active'
    when 'Dropped' then 'dropped'
    end
  end
end
