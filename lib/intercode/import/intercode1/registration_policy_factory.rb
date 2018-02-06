class Intercode::Import::Intercode1::RegistrationPolicyFactory
  def registration_policy(row)
    buckets = %w[Male Female Neutral].map { |gender| registration_bucket(row, gender) }

    if buckets[0].total_slots == 0 && buckets[1].total_slots == 0
      # It's ok to drop both the gendered buckets if there are only neutral slots
      buckets = [buckets[2]]
    elsif buckets[2].total_slots == 0
      # It's ok to drop the neutral bucket if there are no neutral slots
      buckets = [buckets[0], buckets[1]]
    end

    # Note that it's NOT ok to drop just one of the gendered buckets, because
    # that would make it impossible to sign up into the flex bucket if you
    # don't want a character of the gender of the remaining bucket

    if buckets.size == 1 && buckets.first.key == 'flex'
      single_bucket = buckets.first
      single_bucket.assign_attributes(
        key: 'signups',
        name: 'Signups',
        description: 'Signups for this event',
        anything: false
      )
    end

    RegistrationPolicy.new(buckets: buckets)
  end

  def registration_bucket(row, gender)
    key = case gender
    when 'Neutral' then 'flex'
    else gender.downcase
    end

    name = case gender
    when 'Neutral' then 'Flex'
    else "#{gender} role"
    end

    RegistrationPolicy::Bucket.new(
      key: key,
      name: name,
      description: registration_bucket_description(gender),
      slots_limited: true,
      total_slots: row[:"MaxPlayers#{gender}"],
      minimum_slots: row[:"MinPlayers#{gender}"],
      preferred_slots: row[:"PrefPlayers#{gender}"],
      anything: key == 'flex'
    )
  end

  def registration_bucket_description(gender)
    case gender
    when 'Male' then 'Male characters'
    when 'Female' then 'Female characters'
    when 'Neutral' then 'Characters that are not strictly defined as male or female'
    end
  end
end
