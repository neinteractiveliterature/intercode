class Intercode::Import::Intercode1::Tables::Events < Intercode::Import::Intercode1::Table
  def initialize(connection, con)
    super connection
    @con = con
  end

  def dataset
    super.join(:Bids, :EventId => :EventId).select_all(:Events).select_append(:Status)
  end

  private
  def build_record(row)
    @con.events.new(
      title: row[:Title],
      author: row[:Author],
      email: row[:GameEMail],
      organization: row[:Organization],
      url: row[:Homepage],
      notify_on_changes: row[:NotifyOnChanges] == 'Y',
      length_seconds: row[:Hours] * 1.hour,
      can_play_concurrently: row[:CanPlayConcurrently] == 'Y',
      con_mail_destination: con_mail_destination(row),
      description: row[:Description],
      short_blurb: row[:ShortBlurb],
      category: event_category(row),
      status: event_status(row),
      registration_policy: registration_policy(row)
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
      return 'filler'
    end

    case row[:GameType]
    when 'Board Game' then 'board_game'
    when 'Panel' then 'panel'
    when 'Tabletop RPG' then 'tabletop_rpg'
    when 'Other' then nil
    else 'larp'
    end
  end

  def event_status(row)
    case row[:Status]
    when 'Pending' then 'proposed'
    when 'Under Review' then 'reviewing'
    when 'Accepted' then 'accepted'
    when 'Rejected' then 'rejected'
    when 'Dropped' then 'dropped'
    end
  end

  def registration_policy(row)
    buckets = %w(Male Female Neutral).map { |gender| registration_bucket(row, gender) }
    buckets.reject! { |bucket| bucket.total_slots == 0 }
    RegistrationPolicy.new(buckets: buckets)
  end

  def registration_bucket(row, gender)
    RegistrationPolicy::Bucket.new(
      key: gender.downcase,
      slots_limited: true,
      total_slots: row[:"MaxPlayers#{gender}"],
      minimum_slots: row[:"MinPlayers#{gender}"],
      preferred_slots: row[:"PrefPlayers#{gender}"]
    )
  end
end