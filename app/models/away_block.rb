class AwayBlock < ApplicationRecord
  belongs_to :user_con_profile

  validates_presence_of :start, :finish, :user_con_profile
  validate :ensure_no_overlap

  def timespan
    ScheduledValue::Timespan.new(start: start, finish: finish)
  end

  def timespan=(new_timespan)
    case new_timespan
    when nil
      assign_attributes(start: nil, finish: nil)
    when ScheduledValue::Timespan
      assign_attributes(start: new_timespan.start, finish: new_timespan.finish)
    else
      raise ArgumentError, "#{new_timespan.inspect} is neither a ScheduledValue::Timespan nor nil"
    end

    new_timespan
  end

  private
  def ensure_no_overlap
    return unless user_con_profile

    other_away_block_timespans = AwayBlock.where(user_con_profile_id: user_con_profile.id).
      where.not(id: id).
      pluck(:start, :finish).
      map { |(start, finish)| ScheduledValue::Timespan.new(start: start, finish: finish) }

    my_timespan = timespan

    other_away_block_timespans.each do |other_timespan|
      if my_timespan.overlaps?(other_timespan)
        errors.add(:base, "#{timespan} overlaps with another AwayBlock (#{other_timespan})")
      end
    end
  end
end
