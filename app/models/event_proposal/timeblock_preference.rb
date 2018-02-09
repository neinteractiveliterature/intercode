class EventProposal::TimeblockPreference
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_reader :start, :finish
  attr_accessor :label, :ordinality

  def start=(new_start)
    @start = normalize_date_input(new_start)
  end

  def finish=(new_finish)
    @finish = normalize_date_input(new_finish)
  end

  def attributes
    {
      start: start,
      finish: finish,
      label: label,
      ordinality: ordinality
    }
  end

  def ordinality_description
    case ordinality.to_s
    when '1' then '1st Choice'
    when '2' then '2nd Choice'
    when '3' then '3rd Choice'
    when 'X' then 'Not Available'
    end
  end

  def ==(other)
    return self == EventProposal::TimeblockPreference.new(other) if other.is_a?(Hash)
    return self == other.to_unsafe_h if other.is_a?(ActionController::Parameters)
    return false unless other.is_a?(EventProposal::TimeblockPreference)
    
    attributes == other.attributes
  end

  private

  def normalize_date_input(input)
    case input
    when String then Time.iso8601(input)
    else input
    end
  end
end
