# frozen_string_literal: true
require "test_helper"

class Tables::FormItems::FormItemsFieldTest < ActiveSupport::TestCase
  Preference = Struct.new(:ordinality, :start, :label, :ordinality_description)

  let(:convention) { create(:convention) }
  let(:presenter) do
    Tables::EventProposalsTableResultsPresenter.for_convention(convention, create(:site_admin), {}, [])
  end
  let(:field) { presenter.fields[:form_items] }
  let(:bare_field) { Tables::FormItems::FormItemsField.new(presenter) }

  it "requires subclasses to say which form items apply to a row and which could appear in the table" do
    assert_raises(NotImplementedError) { bare_field.form_items_for(Object.new) }
    assert_raises(NotImplementedError) { bare_field.candidate_form_items }
  end

  it "is path-based, and exposes every form item by default" do
    assert_predicate bare_field, :path_based?
    assert bare_field.exposed_form_item?(Object.new)
  end

  it "falls back to the humanized identifier for headers of unknown form items" do
    assert_equal "Some unknown thing", field.csv_header_for_path(["some_unknown_thing"])
  end

  it "exports nothing without a path" do
    assert_nil field.generate_csv_cell(Object.new)
    assert_nil field.generate_csv_cell(Object.new, [])
  end

  describe "timeblock preference formatting" do
    it "groups preferences by ordinality and lists them in order" do
      friday = Time.zone.local(2026, 7, 17, 9)
      saturday = Time.zone.local(2026, 7, 18, 9)
      value = [
        Preference.new(2, saturday, "Morning", "2nd choice"),
        Preference.new(1, saturday, "Afternoon", "1st choice"),
        Preference.new(1, friday, "Evening", "1st choice")
      ]

      result = field.send(:timeblock_preference_to_csv_cell, value)

      assert_equal "1st choice: Friday Evening, Saturday Afternoon\n2nd choice: Saturday Morning", result
    end
  end

  describe "timeblock preference items" do
    it "are formatted through the timeblock preference formatter" do
      form_item = FormItem.new(item_type: "timeblock_preference", identifier: "availability")
      value = [Preference.new(1, Time.zone.local(2026, 7, 17, 9), "Evening", "1st choice")]

      assert_equal "1st choice: Friday Evening", field.send(:form_item_value_to_csv, form_item, value)
    end
  end

  describe "multiple choice formatting" do
    let(:form_item) do
      FormItem.new(
        item_type: "multiple_choice",
        identifier: "genre",
        properties: {
          "choices" => [
            { "value" => "scifi", "caption" => "Science Fiction" },
            { "value" => "horror", "caption" => "Horror" }
          ]
        }
      )
    end

    it "uses captions, and passes unknown values through" do
      assert_equal "Science Fiction, Horror, mystery",
                   field.send(:form_item_value_to_csv, form_item, %w[scifi horror mystery])
      assert_equal "Horror", field.send(:form_item_value_to_csv, form_item, "horror")
    end

    it "exports nil values as nil" do
      assert_nil field.send(:form_item_value_to_csv, form_item, nil)
    end
  end
end
