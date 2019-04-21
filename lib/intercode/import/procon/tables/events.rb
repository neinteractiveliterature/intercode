class Intercode::Import::Procon::Tables::Events < Intercode::Import::Procon::Table
  include Intercode::Import::Procon::EventHelpers
  include Intercode::Import::Procon::UserHelpers

  BUCKET_ATTRS_BY_GENDER = {
    'male' => {
      key: 'female',
      name: 'Female role',
      description: 'Female characters',
      slots_limited: true
    },
    'female' => {
      key: 'male',
      name: 'Male role',
      description: 'Male characters',
      slots_limited: true
    },
    'neutral' => {
      key: 'flex',
      name: 'Flex',
      description: 'Characters that are not strictly defined as male or female',
      slots_limited: true,
      anything: true
    }
  }

  def initialize(connection, convention_id_map, proposed_event_id_map)
    super connection
    @markdownifier = Intercode::Import::Markdownifier.new(logger)
    @convention_id_map = convention_id_map
    @proposed_event_id_map = proposed_event_id_map
  end

  def dataset
    super.where(
      (Sequel.~(Sequel[{ type: 'ProposedEvent' }]) | Sequel[{ type: nil }]) &
      Sequel[{ parent_id: @convention_id_map.keys }]
    )
  end

  private

  def build_record(row)
    convention = @convention_id_map[row[:parent_id]]
    event = convention.events.find_or_create_by(title: row[:fullname]) do |evt|
      evt.assign_attributes(
        event_category: convention.event_categories.find_by!(name: event_category_name(row)),
        registration_policy: registration_policy(row),
        status: 'active',
        event_proposal: @proposed_event_id_map[row[:proposed_event_id]],
        con_mail_destination: 'gms'
      )
      evt.assign_form_response_attributes(form_response_attributes(row))
    end

    create_run_and_rooms(row, event)
  end

  def create_run_and_rooms(row, event)
    run = event.runs.create!(starts_at: force_timezone(row[:start], event.convention.timezone_name))

    location_names = connection[:locations]
      .join(:event_locations, location_id: :id)
      .where(event_id: event.id)
      .map(:name)

    run.rooms = location_names.map do |name|
      event.convention.rooms.find_or_create!(name: name)
    end
    run.save!

    run
  end

  def form_response_attributes(row)
    {
      title: row[:fullname],
      short_name: row[:shortname],
      short_blurb: row[:blurb] || row[:description],
      length_seconds: row[:end].to_i - row[:start].to_i,
      description: row[:description] || row[:blurb],
      can_play_concurrently: can_play_concurrently?(row),
      age_restrictions: age_restrictions(row)
    }
  end

  def registration_policy(row)
    if row[:type] != 'LimitedCapacityEvent'
      if event_registration_open?(row) || event_has_counted_attendances?(row)
        return RegistrationPolicy.unlimited
      end
      return RegistrationPolicy.new
    end

    buckets = buckets_for_event(row)
    RegistrationPolicy.new(buckets: postprocess_buckets(buckets))
  end

  def postprocess_buckets(buckets)
    return buckets unless buckets.select { |bucket| bucket.total_slots > 0 }.map(&:key) == ['flex']

    [
      RegistrationPolicy::Bucket.new(
        buckets.find { |bucket| bucket.key == 'flex' }.attributes.merge(
          key: 'signups',
          name: 'Signups',
          description: 'Signups for this event',
          slots_limited: true,
          anything: false
        )
      )
    ]
  end

  def buckets_for_event(row)
    [
      *connection[:attendee_slots].where(event_id: row[:id]).map do |attendee_slot_row|
        bucket_for_attendee_slot_row(attendee_slot_row)
      end,
      *buckets_for_registration_bucket_rows(
        connection[:registration_buckets].where(event_id: row[:id]).to_a
      )
    ]
  end

  def bucket_for_attendee_slot_row(attendee_slot_row)
    RegistrationPolicy::Bucket.new(
      BUCKET_ATTRS_BY_GENDER[attendee_slot_row[:gender]].merge(
        minimum_slots: attendee_slot_row[:min],
        preferred_slots: attendee_slot_row[:preferred],
        total_slots: attendee_slot_row[:max]
      )
    )
  end

  def buckets_for_registration_bucket_rows(registration_bucket_rows)
    registration_bucket_rows.map do |registration_bucket_row|
      # When ProCon migrated away from the registration_bucket_rows table, the registration_rules
      # rows backing these were lost, so we have to intuit the 'gender' of each signup bucket from
      # the row's position in the list (which we can because the code that generated these was
      # deterministic)
      gender_for_row = if registration_bucket_rows.size == 1
        'neutral'
      else
        case registration_bucket_row[:position]
        when 1 then 'male'
        when 2 then 'female'
        when 3 then 'neutral'
        end
      end

      RegistrationPolicy::Bucket.new(
        BUCKET_ATTRS_BY_GENDER[gender_for_row].merge(
          minimum_slots: registration_bucket_row[:min],
          preferred_slots: registration_bucket_row[:preferred],
          total_slots: registration_bucket_row[:max]
        )
      )
    end
  end

  def event_category_name(row)
    case row[:type]
    when 'LimitedCapacityEvent' then 'Larp'
    else 'Con services'
    end
  end
end
