class Intercode::Import::Intercode1::ProposalFormCustomizer
  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def import!
    logger.info 'Setting omit_timeblocks for proposal form'

    add_omit_timeblocks_for_convention
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def friday_date
    starts_at = @convention.starts_at.in_time_zone(@convention.timezone)

    if starts_at.friday?
      starts_at.beginning_of_day.to_date
    elsif starts_at.thursday?
      (starts_at.beginning_of_day + 1.day).to_date
    end
  end

  def add_omit_timeblocks_for_convention
    return unless friday_date

    item = convention.event_proposal_form.form_items
      .where(identifier: 'timeblock_preferences').first
    return unless item

    item.properties = item.properties.merge(
      'omit_timeblocks' => [{ 'label' => 'Morning', 'date' => friday_date }]
    )
    item.save!
  end
end
