require 'test_helper'

describe ScheduledValue::Timespan do
  let(:start) { Date.new(2015, 1, 1) }
  let(:finish) { Date.new(2015, 3, 1) }
  let(:midway) { start + ((finish - start) / 2) }
  let(:prestart) { start - 1 }
  let(:postfinish) { finish + 1 }

  it "can be initialized with a start or a finish" do
    ScheduledValue::Timespan.new(start: start).start.must_equal start
    ScheduledValue::Timespan.new(finish: finish).finish.must_equal finish
  end

  it "can be initialized with both a start and a finish" do
    both = ScheduledValue::Timespan.new(start: start, finish: finish)
    both.start.must_equal start
    both.finish.must_equal finish
  end

  it "can be initialized without either a start or a finish" do
    ScheduledValue::Timespan.new
  end

  it "cannot be initialized if start and finish are equal" do
    assert_raises do
      ScheduledValue::Timespan.new(start: start, finish: start)
    end
  end

  it "cannot be initialized if finish is before start" do
    assert_raises do
      ScheduledValue::Timespan.new(start: finish, finish: start)
    end
  end

  describe "#contains?" do
    it "contains the start" do
      assert ScheduledValue::Timespan.new(start: start, finish: finish).contains?(start)
    end

    it "contains a date between start and finish" do
      assert ScheduledValue::Timespan.new(start: start, finish: finish).contains?(midway)
    end

    it "doesn't contain the finish" do
      refute ScheduledValue::Timespan.new(start: start, finish: finish).contains?(finish)
    end

    it "contains any date before finish if there's no start" do
      timespan = ScheduledValue::Timespan.new(finish: finish)
      assert timespan.contains?(finish - 1)
      refute timespan.contains?(finish)
    end

    it "contains any date including or after start if there's no finish" do
      timespan = ScheduledValue::Timespan.new(start: start)
      assert timespan.contains?(start + 1)
      assert timespan.contains?(start)
      refute timespan.contains?(start - 1)
    end

    it "unlimited timespans contain all dates" do
      timespan = ScheduledValue::Timespan.new
      assert timespan.contains?(start)
      assert timespan.contains?(finish)
    end
  end

  describe "#overlaps?" do
    let(:timespan) { ScheduledValue::Timespan.new(start: start, finish: finish) }

    it "overlaps itself" do
      assert timespan.overlaps?(timespan.dup)
    end

    it "overlaps a timespan beginning partway through" do
      other = ScheduledValue::Timespan.new(start: midway, finish: finish)
      assert timespan.overlaps?(other)
      assert other.overlaps?(timespan)
    end

    it "overlaps a timespan ending partway through" do
      other = ScheduledValue::Timespan.new(start: start, finish: midway)
      assert timespan.overlaps?(other)
      assert other.overlaps?(timespan)
    end

    it "doesn't overlap a timespan ending immediately prior" do
      other = ScheduledValue::Timespan.new(start: prestart, finish: start)
      refute timespan.overlaps?(other)
      refute other.overlaps?(timespan)
    end

    it "doesn't overlap a timespan starting immediately after" do
      other = ScheduledValue::Timespan.new(start: finish, finish: postfinish)
      refute timespan.overlaps?(other)
      refute other.overlaps?(timespan)
    end

    it "unlimited timespans overlap everything" do
      other = ScheduledValue::Timespan.new
      assert timespan.overlaps?(other)
      assert other.overlaps?(timespan)
    end
  end

  describe "comparing with dates" do
    let(:timespan) { ScheduledValue::Timespan.new(start: start, finish: finish) }

    it "can't be compared to dates within the timespan" do
      (timespan <=> midway).must_be_nil
    end

    it "is less than dates after the timespan" do
      assert timespan < postfinish
    end

    it "is greater than dates before the timespan" do
      assert timespan > prestart
    end
  end

  describe "comparing with timespans" do
    let(:timespan) { ScheduledValue::Timespan.new(start: start, finish: finish) }

    it "equals itself" do
      assert timespan == timespan.dup
    end

    it "can't be compared to overlapping but unequal timespans" do
      (timespan <=> ScheduledValue::Timespan.new(start: prestart, finish: midway)).must_be_nil
      (timespan <=> ScheduledValue::Timespan.new(start: midway, finish: postfinish)).must_be_nil
    end

    it "is less than fully-after timespans" do
      assert timespan < ScheduledValue::Timespan.new(start: finish, finish: postfinish)
      assert timespan < ScheduledValue::Timespan.new(start: finish)
    end

    it "is greater than fully-prior timespans" do
      assert timespan > ScheduledValue::Timespan.new(start: prestart, finish: start)
      assert timespan > ScheduledValue::Timespan.new(finish: start)
    end
  end
end