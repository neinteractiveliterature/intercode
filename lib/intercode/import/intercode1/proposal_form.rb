class Intercode::Import::Intercode1::ProposalForm
  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def import!
    logger.info "Importing proposal form"

    form = convention.create_event_proposal_form!(title: "Proposal form", convention: convention)
    convention.save!

    convention_proposal_form_sections.each do |section_attributes|
      logger.info "Importing section #{section_attributes[:title]}"
      section = form.form_sections.create!(section_attributes.slice(:title))
      (section_attributes[:section_items] || []).each do |item_attributes|
        logger.info "Importing #{item_attributes[:item_type]} item #{item_attributes[:identifier]}"
        direct_properties = item_attributes.slice(:item_type, :identifier, :admin_description)
        other_properties = item_attributes.except(:item_type, :identifier, :admin_description)
        section.form_items.create!(direct_properties.merge(properties: other_properties))
      end
    end
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

  def convention_proposal_form_sections
    basic_proposal_form = JSON.parse(
      File.read(File.expand_path('../basic_proposal_form.json', __FILE__))
    ).map(&:deep_symbolize_keys)

    basic_proposal_form.map do |section_attributes|
      section_items = section_attributes[:section_items].map do |section_item|
        if section_item[:identifier] == 'timeblock_preferences'
          section_item.merge(
            omit_timeblocks: (
              friday_date ? [{ label: 'Morning', date: friday_date }] : []
            )
          )
        else
          section_item
        end
      end

      section_attributes.merge(section_items: section_items)
    end
  end
end
