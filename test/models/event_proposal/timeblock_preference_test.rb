# frozen_string_literal: true
require "test_helper"

class EventProposal::TimeblockPreferenceTest < ActiveSupport::TestCase
  let(:start) { Time.utc(2026, 6, 5, 18, 0, 0) }
  let(:finish) { Time.utc(2026, 6, 5, 22, 0, 0) }

  def preference(**attrs)
    EventProposal::TimeblockPreference.new({ start:, finish:, label: "Evening", ordinality: "1" }.merge(attrs))
  end

  describe "times" do
    it "keeps times as they are" do
      assert_equal start, preference.start
      assert_equal finish, preference.finish
    end

    it "reads ISO 8601 strings" do
      parsed = preference(start: "2026-06-05T18:00:00Z", finish: "2026-06-05T22:00:00-04:00")

      assert_equal start, parsed.start
      assert_equal Time.utc(2026, 6, 6, 2, 0, 0), parsed.finish
    end

    it "raises for a string that is not an ISO 8601 time" do
      assert_raises(ArgumentError) { preference(start: "next tuesday") }
    end

    it "can be changed afterwards" do
      pref = preference
      pref.start = "2026-06-06T10:00:00Z"
      pref.finish = Time.utc(2026, 6, 6, 12)

      assert_equal Time.utc(2026, 6, 6, 10), pref.start
      assert_equal Time.utc(2026, 6, 6, 12), pref.finish
    end
  end

  describe "#attributes and serialization" do
    it "has the four attributes" do
      assert_equal({ start:, finish:, label: "Evening", ordinality: "1" }, preference.attributes)
    end

    it "serializes to JSON" do
      json = preference.as_json

      assert_equal "Evening", json["label"]
      assert_equal "1", json["ordinality"]
      assert_equal start.as_json, json["start"]
    end
  end

  describe "#ordinality_description" do
    {
      "1" => "1st Choice",
      "2" => "2nd Choice",
      "3" => "3rd Choice",
      "X" => "Not Available"
    }.each do |ordinality, description|
      it "describes #{ordinality} as #{description}" do
        assert_equal description, preference(ordinality:).ordinality_description
      end
    end

    it "understands ordinalities given as numbers" do
      assert_equal "2nd Choice", preference(ordinality: 2).ordinality_description
    end

    it "has no description for anything else" do
      assert_nil preference(ordinality: "4").ordinality_description
      assert_nil preference(ordinality: nil).ordinality_description
    end
  end

  describe "#==" do
    it "is equal to another preference with the same attributes" do
      assert_equal preference, preference
    end

    it "is not equal when any attribute differs" do
      assert_not_equal preference, preference(label: "Other")
      assert_not_equal preference, preference(ordinality: "2")
      assert_not_equal preference, preference(start: start + 1.hour)
      assert_not_equal preference, preference(finish: finish + 1.hour)
    end

    it "is equal to a hash of its attributes, with string or symbol keys" do
      assert_equal preference, { start:, finish:, label: "Evening", ordinality: "1" }
      assert_equal preference,
                   { "start" => "2026-06-05T18:00:00Z", "finish" => finish, "label" => "Evening", "ordinality" => "1" }
    end

    it "is equal to controller parameters with its attributes" do
      params =
        ActionController::Parameters.new(
          start: "2026-06-05T18:00:00Z",
          finish: "2026-06-05T22:00:00Z",
          label: "Evening",
          ordinality: "1"
        )

      assert_equal preference, params
    end

    it "is not equal to something else" do
      assert_not_equal preference, "Evening"
      assert_not_equal preference, nil
    end
  end
end
