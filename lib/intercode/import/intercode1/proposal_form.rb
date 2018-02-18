class Intercode::Import::Intercode1::ProposalForm
  attr_reader :convention, :form_importer

  def initialize(convention)
    @convention = convention
    @form_importer = Intercode::Import::Intercode1::FormImporter.new(
      File.expand_path('../basic_proposal_form.json', __FILE__)
    )

    add_omit_timeblocks_for_convention
  end

  def import!
    logger.info 'Importing proposal form'

    form = convention.create_event_proposal_form!(title: 'Proposal form', convention: convention)
    convention.save!

    form_importer.import(form)
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
    form_importer.data['sections'].each do |section_attributes|
      section_attributes['section_items'].each do |section_item|
        next unless section_item['identifier'] == 'timeblock_preferences'
        section_item.merge!(
          'omit_timeblocks' => (
            friday_date ? [{ 'label' => 'Morning', 'date' => friday_date }] : []
          )
        )
      end
    end
  end
end
