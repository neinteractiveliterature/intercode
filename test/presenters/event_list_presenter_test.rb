require 'test_helper'

describe EventListPresenter do
  let(:convention) { FactoryBot.create(:convention) }

  it 'should return events in title order' do
    ['The Deadening', 'A Garden of Spooning Paths', 'Final Voyage of the Mary Celeste'].each do |title|
      FactoryBot.create(:event, convention: convention, title: title, short_blurb: title)
    end

    assert_equal(
      ['The Deadening', 'Final Voyage of the Mary Celeste', 'A Garden of Spooning Paths'],
      EventListPresenter.new(convention, sort: 'title').sorted_events.map(&:title)
    )
  end

  describe 'accepted order sorts' do
    let(:event1) { FactoryBot.create(:event, convention: convention, short_blurb: 'event1') }
    let(:event2) { FactoryBot.create(:event, convention: convention, short_blurb: 'event2') }

    before do
      event1
      travel 1.hour
      event2
    end

    it 'should sort by accepted order ascending' do
      assert_equal [event1, event2], EventListPresenter.new(convention, sort: 'accepted_asc').sorted_events
    end

    it 'should sort by accepted order descending' do
      assert_equal [event2, event1], EventListPresenter.new(convention, sort: 'accepted_desc').sorted_events
    end
  end

  it 'should sort by first run start order' do
    event1 = FactoryBot.create(:event, convention: convention, short_blurb: 'event1')
    travel 1.hour
    event2 = FactoryBot.create(:event, convention: convention, short_blurb: 'event2')

    event1_run1 = FactoryBot.create(:run, event: event1, starts_at: convention.starts_at + 6.hours)
    event2_run1 = FactoryBot.create(:run, event: event2, starts_at: convention.starts_at + 5.hours)
    travel 1.hour
    event1_run2 = FactoryBot.create(:run, event: event1, starts_at: convention.starts_at + 4.hours)
    event2_run2 = FactoryBot.create(:run, event: event2, starts_at: convention.starts_at + 3.hours)

    assert_equal [event2, event1], EventListPresenter.new(convention, sort: 'first_scheduled_run').sorted_events
  end

  it 'should error if given an unknown sort' do
    assert_raises(EventListPresenter::UnknownSortError) do
      EventListPresenter.new(convention, sort: 'how_good_the_game_is').sorted_events
    end
  end
end
