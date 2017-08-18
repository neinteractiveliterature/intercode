class Intercode::Import::Intercode1::RegistrationPolicyFactory
  def registration_policy(row)
    buckets = %w(Male Female Neutral).map { |gender| registration_bucket(row, gender) }
    buckets.reject! { |bucket| bucket.total_slots == 0 }
    RegistrationPolicy.new(buckets: buckets)
  end

  def registration_bucket(row, gender)
    key = case gender
    when 'Neutral' then 'anything'
    else gender.downcase
    end

    name = case gender
    when 'Neutral' then 'Anything'
    else gender
    end

    RegistrationPolicy::Bucket.new(
      key: key,
      name: name,
      description: registration_bucket_description(gender),
      slots_limited: true,
      total_slots: row[:"MaxPlayers#{gender}"],
      minimum_slots: row[:"MinPlayers#{gender}"],
      preferred_slots: row[:"PrefPlayers#{gender}"],
      anything: key == 'anything'
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
