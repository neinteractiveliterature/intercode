class Intercode::Import::Intercode1::Tables::Bids < Intercode::Import::Intercode1::Table
  YN_TO_BOOL = ->(value) { value == 'Y' }

  BID_STATUS_MAP = {
    # no Draft status in Intercode 1
    'Pending' => 'proposed',
    'Under Review' => 'reviewing',
    'Accepted' => 'accepted',
    'Rejected' => 'rejected',
    'Dropped' => 'dropped'
  }

  BID_ATTRIBUTES = {
    Title: { form_field: 'title' },
    Author: { form_field: 'authors' },
    Organization: { form_field: 'organization' },
    Homepage: { form_field: 'url' },
    GameEMail: { form_field: 'email' },
    Hours: {
      form_field: 'length_seconds',
      convert: -> (value) { value * 1.hour },
    },
    Description: {
      form_field: 'description',
      markdownify: true
    },
    ShortBlurb: {
      form_field: 'short_blurb',
      markdownify: true
    },
    PlayerCommunications: { form_field: 'player_communications' },
    Genre: { form_field: 'genre' },
    OngoingCampaign: {
      form_field: 'ongoing_campaign',
      convert: YN_TO_BOOL
    },
    RunBefore: { form_field: 'run_before' },
    GameSystem: { form_field: 'game_system' },
    CombatResolution: { form_field: 'combat_resolution' },
    Premise: { form_field: 'other_committee_info' },
    SetupTeardown: { form_field: 'setup_teardown' },
    GMs: { form_field: 'gms' },
    OtherGames: { form_field: 'other_games' },
    Offensive: { form_field: 'offensive' },
    PhysicalRestrictions: { form_field: 'physical_restrictions' },
    AgeAppropriate: { form_field: 'age_appropriate' },
    CanPlayConcurrently: {
      form_field: 'can_play_concurrently',
      convert: YN_TO_BOOL
    },
    MultipleRuns: {
      form_field: 'multiple_runs',
      convert: YN_TO_BOOL
    },
    SchedulingConstraints: { form_field: 'scheduling_constraints' },
    SpaceRequirements: { form_field: 'space_requirements' },

    # Fields we don't actually ask anymore
    ShortSentence: { form_field: 'short_sentence' },
    ShamelessPlugs: { form_field: 'shameless_plugs' },
    GMGameAdvertising: { form_field: 'gm_game_advertising' },
    GMConAdvertising: { form_field: 'gm_con_advertising' },
    SendFlyers: {
      form_field: 'send_flyers',
      convert: YN_TO_BOOL
    },
    IsSmallGameContestEntry: {
      form_field: 'is_small_games_contest_entry',
      convert: YN_TO_BOOL
    }

    # OtherGMs: It doesn't seem that we've ever asked this, at least
    # not since we started using source control
  }

  def initialize(connection, convention, events_id_map, user_con_profile_id_map)
    super connection

    @convention = convention
    @events_id_map = events_id_map
    @user_con_profile_id_map = user_con_profile_id_map
    @markdownifier = Intercode::Import::Intercode1::Markdownifier.new(logger)
    @registration_policy_factory = Intercode::Import::Intercode1::RegistrationPolicyFactory.new
  end

  private
  def build_record(row)
    record = @convention.event_proposals.new(
      owner: @user_con_profile_id_map[row[:UserId]],
      event: @events_id_map[row[:EventId]],
      status: BID_STATUS_MAP[row[:Status]]
    )
    record.assign_form_response_attributes(form_response_attributes(row))
    record
  end

  def row_id(row)
    row[:BidId]
  end

  def form_response_attributes(row)
    attrs = BID_ATTRIBUTES.each_with_object({}) do |(bid_attr, options), form_response_attributes|
      form_field = options[:form_field]
      next unless row.has_key?(bid_attr)

      value = process_value(row[bid_attr], options)
      form_response_attributes[form_field] = value
    end

    attrs.merge(
      'registration_policy' => @registration_policy_factory.registration_policy(row)
    )
  end

  def process_value(value, options)
    return nil unless value

    if options[:convert]
      options[:convert].call(value)
    elsif options[:markdownify]
      @markdownifier.markdownify(value)
    else
      value
    end
  end
end
