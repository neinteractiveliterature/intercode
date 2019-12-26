require 'test_helper'

class CloneConventionServiceTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:new_convention_attributes) do
    {
      name: 'CopyCon',
      domain: 'copycon.example.com',
      maximum_event_signups: ScheduledValue::ScheduledValue.always('unlimited'),
      starts_at: Time.new(2018, 10, 28, 18, 0, 0),
      ends_at: Time.new(2018, 10, 30, 18, 0, 0)
    }
  end
  let(:service) { CloneConventionService.new(source_convention: convention, new_convention_attributes: new_convention_attributes) }

  it 'clones only some convention attributes' do
    convention.update!(
      starts_at: Time.now,
      ends_at: 3.days.from_now,
      show_schedule: 'yes',
      accepting_proposals: true,
      maximum_tickets: 500,
      ticket_name: 'penguin',
      timezone_name: 'America/Chicago',
      stripe_publishable_key: 'pk_test_12345',
      stripe_secret_key: 'sk_test_12345',
      clickwrap_agreement: 'I agree to abide by the {{ convention.name }} code of conduct.'
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
    assert_equal 'pk_test_12345', result.convention.stripe_publishable_key
    assert_equal 'sk_test_12345', result.convention.stripe_secret_key
    assert_equal 'I agree to abide by the {{ convention.name }} code of conduct.', result.convention.clickwrap_agreement
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
    create(:event_category, convention: convention)
    result = service.call
    assert result.success?
    result.convention.reload
    assert_equal 1, result.convention.event_categories.count
  end

  it 'clones rooms' do
    create_list(:room, 5, convention: convention)
    result = service.call
    result.convention.reload
    assert_equal 5, result.convention.rooms.count
  end

  it 'clones ticket types' do
    create(
      :paid_ticket_type,
      convention: convention,
      pricing_schedule: ScheduledMoneyValue.new(
        timespans: [
          { start: Time.utc(2016, 1, 1, 0, 0, 0), finish: Time.utc(2016, 6, 1, 0, 0, 0), value: Money.new(2500, 'USD') },
          { start: Time.utc(2016, 6, 1, 0, 0, 0), finish: Time.utc(2016, 10, 1, 0, 0, 0), value: Money.new(3500, 'USD') },
          { start: Time.utc(2016, 10, 1, 0, 0, 0), finish: Time.utc(2016, 10, 26, 0, 0, 0), value: Money.new(4500, 'USD') }
        ]
      )
    )
    result = service.call
    result.convention.reload
    assert result.success?

    cloned_pricing_schedule = result.convention.ticket_types.first.pricing_schedule
    assert_equal Time.utc(2017, 12, 31, 0, 0, 0), cloned_pricing_schedule.timespans.first.start
  end

  it 'clones staff positions' do
    ClearCmsContentService.new(convention: convention).call!
    LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
    event_category = create(:event_category, convention: convention)
    staff_position = create(:staff_position, convention: convention)
    staff_position.permissions.create!(model: event_category, permission: 'read_event_proposals')

    result = service.call
    result.convention.reload
    assert result.success?
    assert_equal 1, result.convention.staff_positions.count
    assert_equal staff_position.name, result.convention.staff_positions.first.name
    assert result.convention.staff_positions.first.permissions.first.model
    refute_equal staff_position.permissions.first.model, result.convention.staff_positions.first.permissions.first.model
  end

  it 'clones store content' do
    create(:product, convention: convention)
    product_with_variants = create(:product, convention: convention)
    create_list(:product_variant, 5, product: product_with_variants)

    result = service.call
    result.convention.reload
    assert result.success?
    assert_equal 2, result.convention.products.count
    assert_equal 5, ProductVariant.joins(:product).where(products: { convention_id: result.convention.id }).count
  end

  it 'clones user activity alerts' do
    alert = create(:user_activity_alert, convention: convention)
    staff_position = create(:staff_position, convention: convention)
    alert.notification_destinations.create!(staff_position: staff_position)

    result = service.call
    result.convention.reload
    assert result.success?
    assert_equal 1, result.convention.user_activity_alerts.count
    assert_equal 1, result.convention.user_activity_alerts.first.notification_destinations.count
  end
end
