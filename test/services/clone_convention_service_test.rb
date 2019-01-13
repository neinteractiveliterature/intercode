require 'test_helper'

class CloneConventionServiceTest < ActiveSupport::TestCase
  let(:convention) { FactoryBot.create(:convention) }
  let(:new_convention_attributes) {
    {
      name: 'CopyCon',
      domain: 'copycon.example.com',
      maximum_event_signups: ScheduledValue::ScheduledValue.always('unlimited'),
      starts_at: Time.new(2018, 10, 28, 18, 0, 0),
      ends_at: Time.new(2018, 10, 30, 18, 0, 0)
    }
  }
  let(:service) { CloneConventionService.new(source_convention: convention, new_convention_attributes: new_convention_attributes) }

  it 'clones only some convention attributes' do
    convention.update!(
      starts_at: Time.now,
      ends_at: 3.days.from_now,
      show_schedule: 'yes',
      accepting_proposals: true,
      maximum_tickets: 500,
      ticket_name: 'penguin',
      timezone_name: 'America/Chicago'
    )
    result = service.call
    assert result.success?

    assert_equal Time.new(2018, 10, 28, 18, 0, 0), result.convention.starts_at
    assert_equal Time.new(2018, 10, 30, 18, 0, 0), result.convention.ends_at
    assert_equal 'no', result.convention.show_schedule
    refute result.convention.accepting_proposals
    assert_equal 500, result.convention.maximum_tickets
    assert_equal 'penguin', result.convention.ticket_name
    assert_equal 'America/Chicago', result.convention.timezone_name
  end

  it 'clones CMS content' do
    ClearCmsContentService.new(convention: convention).call!
    File.open(__FILE__) do |f|
      convention.cms_files.create!(file: f)
    end
    LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
    result = service.call
    assert result.success?
  end

  it 'clones event categories' do
    ClearCmsContentService.new(convention: convention).call!
    LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
    FactoryBot.create(:event_category, convention: convention)
    result = service.call
    assert result.success?
    assert_equal 1, result.convention.event_categories.count
  end

  it 'clones rooms'

  it 'clones ticket types' do
    FactoryBot.create(
      :paid_ticket_type,
      convention: convention,
      pricing_schedule: ScheduledMoneyValue.new(
        timespans: [
          { start: Time.utc(2016, 1, 1, 0, 0, 0), finish: Time.utc(2016, 6, 1, 0, 0, 0), value: Money.new(2500, 'USD') },
          { start: Time.utc(2016, 6, 1, 0, 0, 0), finish: Time.utc(2016, 10, 1, 0, 0, 0), value: Money.new(3500, 'USD') },
          { start: Time.utc(2016, 10, 1, 0, 0, 0), finish: Time.utc(2016, 10, 26, 0, 0, 0), value: Money.new(4500, 'USD') },
        ]
      )
    )
    result = service.call
    assert result.success?

    cloned_pricing_schedule = result.convention.ticket_types.first.pricing_schedule
    assert_equal Time.utc(2017, 12, 31, 0, 0,0), cloned_pricing_schedule.timespans.first.start
  end

  it 'clones staff positions' do
    ClearCmsContentService.new(convention: convention).call!
    LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
    event_category = FactoryBot.create(:event_category, convention: convention)
    staff_position = FactoryBot.create(:staff_position, convention: convention)
    staff_position.permissions.create!(model: event_category, permission: 'read_event_proposals')

    result = service.call
    assert result.success?
    assert_equal 1, result.convention.staff_positions.count
    assert_equal staff_position.name, result.convention.staff_positions.first.name
    assert result.convention.staff_positions.first.permissions.first.model
    refute_equal staff_position.permissions.first.model, result.convention.staff_positions.first.permissions.first.model
  end

  it 'clones store content'

  it 'clones user activity alerts'
end
