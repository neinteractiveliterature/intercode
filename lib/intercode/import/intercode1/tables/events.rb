class Intercode::Import::Intercode1::Tables::Events < Intercode::Import::Intercode1::Table
  INTERCON_Q_PRECON_PREFIXES = %w[DISCUSSION PANEL RANT WORKSHOP PRESENTATION MEETUP]

  def initialize(connection, con)
    super connection
    @con = con
    @markdownifier = Intercode::Import::Markdownifier.new(logger)
    @registration_policy_factory = Intercode::Import::Intercode1::RegistrationPolicyFactory.new
  end

  def dataset
    super.left_outer_join(:Bids, EventId: :EventId).select_all(:Events)
      .select_append(:Status)
      .where(Status: %w[Accepted Dropped]).or(SpecialEvent: 1)
  end

  private

  def build_record(row)
    category = event_category(row)

    @con.events.new(
      title: event_title(row),
      author: row[:Author],
      email: row[:GameEMail],
      organization: row[:Organization],
      url: row[:Homepage],
      length_seconds: row[:Hours] * 1.hour,
      can_play_concurrently: row[:CanPlayConcurrently] == 'Y',
      con_mail_destination: con_mail_destination(row),
      description: @markdownifier.markdownify(row[:Description]),
      short_blurb: @markdownifier.markdownify(row[:ShortBlurb]),
      participant_communications: @markdownifier.markdownify(row[:PlayerCommunications]),
      category: category,
      status: event_status(row),
      registration_policy: registration_policy(row, category),
      bypass_single_event_run_check: true # we won't yet have the run for filler events

      # notify_on_changes: this doesn't seem to be used anymore
    )
  end

  def row_id(row)
    row[:EventId]
  end

  def con_mail_destination(row)
    case row[:ConMailDest].presence
    when 'GameMail' then 'event_email'
    when 'GMs' then 'gms'
    when nil
      row[:GameEMail].present? ? 'event_email' : 'gms'
    else raise "Unknown ConMailDest value: #{row[:ConMailDest]}"
    end
  end

  def event_category(row)
    return 'volunteer_event' if row[:IsOps] == 'Y' || row[:IsConSuite] == 'Y'

    if row[:SpecialEvent] == 1
      intercon_q_precon_event = parse_intercon_q_precon_event(row)
      return 'panel' if intercon_q_precon_event
      return 'filler'
    end

    event_category_for_game_type(row[:GameType])
  end

  def event_category_for_game_type(game_type)
    case game_type
    when 'Board Game' then 'board_game'
    when 'Panel' then 'panel'
    when 'Tabletop RPG' then 'tabletop_rpg'
    when 'Other' then nil
    else 'larp'
    end
  end

  def parse_intercon_q_precon_event(row)
    return unless row[:SpecialEvent] == 1

    INTERCON_Q_PRECON_PREFIXES.each do |prefix|
      return [prefix, Regexp.last_match(1)] if row[:Title] =~ /\A#{prefix}\s*[:-]\s*(.*)\z/
    end

    nil
  end

  def event_title(row)
    intercon_q_precon_event = parse_intercon_q_precon_event(row)

    if intercon_q_precon_event
      find_unique_title(intercon_q_precon_event[1])
    else
      find_unique_title(row[:Title])
    end
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

  def registration_policy(row, category)
    case category
    when 'larp', 'volunteer_event' then @registration_policy_factory.registration_policy(row)
    else RegistrationPolicy.unlimited
    end
  end
end
