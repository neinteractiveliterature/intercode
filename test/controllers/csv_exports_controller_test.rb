# frozen_string_literal: true
require "test_helper"

describe CsvExportsController::RunSignupsFilenameFinder do
  let(:finder) { CsvExportsController::RunSignupsFilenameFinder.new }
  let(:convention) { create(:convention) }
  let(:event) { create(:event, convention: convention) }

  describe "#unique_filename" do
    it "disambiguates runs by start day when they share a title" do
      run1 = create(:run, event: event, starts_at: convention.starts_at)
      create(:run, event: event, starts_at: convention.starts_at + 1.day)

      assert_equal(
        "#{event.title} (#{run1.starts_at.strftime("%a")}) Signups",
        finder.unique_filename(event, run1, "Signups")
      )
    end

    it "uses just the event title when the event has only one run" do
      run = create(:run, event: event, starts_at: convention.starts_at)

      assert_equal "#{event.title} Signups", finder.unique_filename(event, run, "Signups")
    end
  end
end
