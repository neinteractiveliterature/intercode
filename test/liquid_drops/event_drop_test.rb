# frozen_string_literal: true
require "test_helper"

describe EventDrop do
  let(:event) { create(:event) }
  let(:event_drop) { EventDrop.new(event) }

  it "returns the title of the event" do
    assert_equal event.title, event_drop.title
  end

  it "returns the team member name of the event category" do
    assert_equal event.event_category.team_member_name, event_drop.team_member_name
  end

  describe "with team members" do
    let(:team_members) { Array.new(5) { create(:team_member, event: event) } }

    before { team_members }

    it "returns the user con profiles of the team members of the event" do
      assert_equal team_members.map(&:user_con_profile_id).sort, event_drop.team_member_user_con_profiles.map(&:id).sort
    end
  end

  it "returns the event path" do
    assert_match %r{events/#{event.id}}, event_drop.url
  end

  describe "markdown fields" do
    let(:event) { create(:event, description: "a description", short_blurb: "a blurb") }

    it "only queries image attachments once across multiple markdown fields" do
      queries =
        count_queries(/SELECT "active_storage_attachments"/) do
          event_drop.description
          event_drop.short_blurb
        end
      assert_operator queries, :<=, 1, "expected a constant number of image attachment queries"
    end
  end

  private

  def count_queries(pattern)
    count = 0
    subscriber =
      ActiveSupport::Notifications.subscribe("sql.active_record") do |*, payload|
        count += 1 if pattern.match?(payload[:sql])
      end
    yield
    count
  ensure
    ActiveSupport::Notifications.unsubscribe(subscriber) if subscriber
  end
end
