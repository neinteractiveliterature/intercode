class Intercode::Import::Intercode1::Tables::Events < Intercode::Import::Intercode1::Table
  INTERCON_Q_PRECON_PREFIXES = ['DISCUSSION', 'PANEL', 'RANT', 'WORKSHOP', 'PRESENTATION', 'MEETUP']

  def initialize(connection, con)
    super connection
    @con = con
    @markdownifier = Intercode::Import::Intercode1::Markdownifier.new(logger)
    @registration_policy_factory = Intercode::Import::Intercode1::RegistrationPolicyFactory.new
  end

  def dataset
    super.left_outer_join(:Bids, :EventId => :EventId).select_all(:Events).
      select_append(:Status).
      where(Status: ['Accepted', 'Dropped']).or(SpecialEvent: 1)
  end

  private
  def build_record(row)
    @con.events.new(
      title: event_title(row),
      author: row[:Author],
      email: row[:GameEMail],
      organization: row[:Organization],
      url: row[:Homepage],
      notify_on_changes: row[:NotifyOnChanges] == 'Y',
      length_seconds: row[:Hours] * 1.hour,
      can_play_concurrently: row[:CanPlayConcurrently] == 'Y',
      con_mail_destination: con_mail_destination(row),
      description: @markdownifier.markdownify(row[:Description]),
      short_blurb: @markdownifier.markdownify(row[:ShortBlurb]),
      category: event_category(row),
      status: event_status(row),
      registration_policy: @registration_policy_factory.registration_policy(row)
    )
  end

  def row_id(row)
    row[:EventId]
  end

  def con_mail_destination(row)
    case row[:ConMailDest]
    when 'GameMail' then 'event_email'
    when 'GMs' then 'gms'
    when nil then nil
    else raise "Unknown ConMailDest value: #{row[:ConMailDest]}"
    end
  end

  def event_category(row)
    if row[:IsOps] == 'Y' || row[:IsConSuite] == 'Y'
      return 'volunteer_event'
    end

    if row[:SpecialEvent] == 1
      intercon_q_precon_event = parse_intercon_q_precon_event(row)
      if intercon_q_precon_event
        return 'panel'
      else
        return 'filler'
      end
    end

    case row[:GameType]
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
      if row[:Title] =~ /\A#{prefix}\s*[:-]\s*(.*)\z/
        return [prefix, $1]
      end
    end

    nil
  end

  def event_title(row)
    intercon_q_precon_event = parse_intercon_q_precon_event(row)

    if intercon_q_precon_event
      intercon_q_precon_event[1]
    else
      row[:Title]
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
