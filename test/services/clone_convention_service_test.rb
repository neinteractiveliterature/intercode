require "test_helper"

class CloneConventionServiceTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:new_convention_attributes) do
    {
      name: "CopyCon",
      domain: "copycon.example.com",
      starts_at: Time.utc(2018, 10, 28, 18, 0, 0),
      ends_at: Time.utc(2018, 10, 30, 18, 0, 0),
      email_from: "noreply@copycon.example.com"
    }
  end
  let(:service) { CloneConventionService.new(source_convention: convention, new_convention_attributes:) }

  it "clones only some convention attributes" do
    convention.update!(
      starts_at: Time.now.utc,
      ends_at: 3.days.after(Time.now.utc),
      show_schedule: "yes",
      accepting_proposals: true,
      maximum_tickets: 500,
      ticket_name: "penguin",
      timezone_name: "America/Chicago",
      stripe_account_id: "acct_12345",
      clickwrap_agreement: "I agree to abide by the {{ convention.name }} code of conduct."
    )
    result = service.call!
    assert result.success?

    assert_equal Time.utc(2018, 10, 28, 18, 0, 0), result.convention.starts_at
    assert_equal Time.utc(2018, 10, 30, 18, 0, 0), result.convention.ends_at
    assert_equal "no", result.convention.show_schedule
    refute result.convention.accepting_proposals
    assert_equal 500, result.convention.maximum_tickets
    assert_equal "penguin", result.convention.ticket_name
    assert_equal "America/Chicago", result.convention.timezone_name
    assert_equal "acct_12345", result.convention.stripe_account_id
    assert_equal(
      "I agree to abide by the {{ convention.name }} code of conduct.",
      result.convention.clickwrap_agreement
    )
  end

  it "clones signup rounds" do
    convention.signup_rounds.first.update!(executed_at: Time.now)
    create(:signup_round, convention:, start: convention.starts_at - 30.days, maximum_event_signups: "unlimited")

    result = service.call!
    assert result.success?

    new_rounds = result.convention.signup_rounds.chronological.to_a
    assert_nil new_rounds[0].executed_at
    assert_nil new_rounds[0].start
    assert_equal "not_yet", new_rounds[0].maximum_event_signups
    assert_equal Time.utc(2018, 9, 28, 18, 0, 0), new_rounds[1].start
    assert_equal "unlimited", new_rounds[1].maximum_event_signups
  end

  it "clones CMS content" do
    ClearCmsContentService.new(convention:).call!
    File.open(__FILE__) { |f| convention.cms_files.create!(file: { io: f, filename: File.basename(__FILE__) }) }
    LoadCmsContentSetService.new(convention:, content_set_name: "standard").call!
    result = service.call!
    assert result.success?
  end

  it "clones event categories" do
    ClearCmsContentService.new(convention:).call!
    LoadCmsContentSetService.new(convention:, content_set_name: "standard").call!
    create(:event_category, convention:)
    convention.reload
    result = service.call!
    assert result.success?
    result.convention.reload
    assert_equal 1, result.convention.event_categories.count
  end

  it "clones rooms" do
    create_list(:room, 5, convention:)
    result = service.call!
    result.convention.reload
    assert_equal 5, result.convention.rooms.count
  end

  it "clones ticket types" do
    ticket_type = create(:paid_ticket_type, convention:)
    ticket_type.providing_products.first.update!(
      pricing_structure:
        PricingStructure.new(
          pricing_strategy: "scheduled_value",
          value:
            ScheduledMoneyValue.new(
              timespans: [
                {
                  start: Time.utc(2016, 1, 1, 0, 0, 0),
                  finish: Time.utc(2016, 6, 1, 0, 0, 0),
                  value: Money.new(2500, "USD")
                },
                {
                  start: Time.utc(2016, 6, 1, 0, 0, 0),
                  finish: Time.utc(2016, 10, 1, 0, 0, 0),
                  value: Money.new(3500, "USD")
                },
                {
                  start: Time.utc(2016, 10, 1, 0, 0, 0),
                  finish: Time.utc(2016, 10, 26, 0, 0, 0),
                  value: Money.new(4500, "USD")
                }
              ]
            )
        )
    )
    result = service.call!
    result.convention.reload
    assert result.success?

    cloned_pricing_schedule = result.convention.ticket_types.first.providing_products.first.pricing_structure.value
    assert_equal Time.utc(2017, 12, 31, 0, 0, 0), cloned_pricing_schedule.timespans.first.start
  end

  it "clones staff positions" do
    ClearCmsContentService.new(convention:).call!
    LoadCmsContentSetService.new(convention:, content_set_name: "standard").call!
    event_category = create(:event_category, convention:)
    staff_position = create(:staff_position, convention:)
    staff_position.permissions.create!(model: event_category, permission: "read_event_proposals")
    convention.reload

    result = service.call!
    assert result.success?
    result.convention.reload
    assert_equal 1, result.convention.staff_positions.count
    assert_equal staff_position.name, result.convention.staff_positions.first.name
    assert result.convention.staff_positions.first.permissions.first.model
    refute_equal(
      staff_position.permissions.first.model,
      result.convention.staff_positions.first.permissions.first.model
    )
  end

  it "clones store content" do
    create(:product, convention:)
    product_with_variants = create(:product, convention:)
    create_list(:product_variant, 5, product: product_with_variants)

    result = service.call!
    result.convention.reload
    assert result.success?
    assert_equal 2, result.convention.products.count
    assert_equal(5, ProductVariant.joins(:product).where(products: { convention_id: result.convention.id }).count)
  end

  it "clones user activity alerts" do
    alert = create(:user_activity_alert, convention:)
    staff_position = create(:staff_position, convention:)
    alert.notification_destinations.create!(staff_position:)

    result = service.call!
    result.convention.reload
    assert result.success?
    assert_equal 1, result.convention.user_activity_alerts.count
    assert_equal 1, result.convention.user_activity_alerts.first.notification_destinations.count
  end

  it "does not clone coupons" do
    create(:coupon, convention:)

    result = service.call!
    result.convention.reload
    assert result.success?
    assert_equal 0, result.convention.coupons.count
  end
end
