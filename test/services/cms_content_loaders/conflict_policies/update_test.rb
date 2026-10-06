# frozen_string_literal: true
require "test_helper"

class CmsContentLoaders::ConflictPolicies::UpdateTest < ActiveSupport::TestCase
  Policy = CmsContentLoaders::ConflictPolicies::Update
  Item = Struct.new(:identifier, :model)
  Model = Struct.new(:content, :name, :skip_clickwrap_agreement)

  # The existing item is what's in the database now, the previous content is what the last load put there, and the
  # new attributes are what's about to be loaded
  def action(previous:, existing:, incoming:, identifier: "page")
    policy = Policy.new({ identifier => previous })
    action = policy.action_for(Item.new(identifier, existing), Item.new(identifier, nil), incoming)
    [action, policy]
  end

  describe "#action_for" do
    it "overwrites an item that has not been touched since it was loaded" do
      result, =
        action(previous: { "content" => "Original" }, existing: Model.new("Original"), incoming: { "content" => "New" })

      assert_equal :overwrite, result
    end

    it "skips an item that has been edited since it was loaded" do
      result, =
        action(previous: { "content" => "Original" }, existing: Model.new("Edited"), incoming: { "content" => "New" })

      assert_equal :skip, result
    end

    it "overwrites an item that was edited to match what is about to be loaded" do
      result, =
        action(previous: { "content" => "Original" }, existing: Model.new("New"), incoming: { "content" => "New" })

      assert_equal :overwrite, result
    end

    it "ignores whitespace around values" do
      result, =
        action(
          previous: {
            "content" => "Original\n"
          },
          existing: Model.new("  Original "),
          incoming: {
            "content" => "New"
          }
        )

      assert_equal :overwrite, result
    end

    it "understands symbol keys" do
      result, = action(previous: { content: "Original" }, existing: Model.new("Original"), incoming: { content: "New" })

      assert_equal :overwrite, result
    end

    it "skips if any of the attributes was edited" do
      result, =
        action(
          previous: {
            "content" => "Original",
            "name" => "Page"
          },
          existing: Model.new("Original", "Renamed"),
          incoming: {
            "content" => "New",
            "name" => "Page"
          }
        )

      assert_equal :skip, result
    end

    it "copes with attributes that are not text" do
      result, =
        action(
          previous: {
            "content" => "Original",
            "skip_clickwrap_agreement" => false
          },
          existing: Model.new("Original", "Page", false),
          incoming: {
            "content" => "New",
            "skip_clickwrap_agreement" => false
          }
        )

      assert_equal :overwrite, result
    end

    it "skips an item whose non-text attribute was changed" do
      result, =
        action(
          previous: {
            "content" => "Original",
            "skip_clickwrap_agreement" => false
          },
          existing: Model.new("Original", "Page", true),
          incoming: {
            "content" => "New",
            "skip_clickwrap_agreement" => false
          }
        )

      assert_equal :skip, result
    end

    it "treats an item with no model as unmodified" do
      result, = action(previous: { "content" => "Original" }, existing: nil, incoming: { "content" => "New" })

      assert_equal :overwrite, result
    end
  end

  describe "what is skipped" do
    it "is recorded with the item and why" do
      _result, policy =
        action(previous: { "content" => "Original" }, existing: Model.new("Edited"), incoming: { "content" => "New" })

      assert_equal 1, policy.skipped_items.size
      skipped = policy.skipped_items.first
      assert_equal "page", skipped.identifier
      assert_equal({ "content" => "New" }, skipped.attrs)
      assert_equal("skipped #{Model.name} page because content has been modified", skipped.message)
    end

    it "names every modified attribute, pluralizing correctly" do
      _result, policy =
        action(
          previous: {
            "content" => "Original",
            "name" => "Page"
          },
          existing: Model.new("Edited", "Renamed"),
          incoming: {
            "content" => "New",
            "name" => "Page"
          }
        )

      assert_match(/content and name have been modified/, policy.skipped_items.first.message)
    end

    it "records nothing for items that are overwritten" do
      _result, policy =
        action(previous: { "content" => "Original" }, existing: Model.new("Original"), incoming: { "content" => "New" })

      assert_empty policy.skipped_items
    end
  end

  describe "items that were not in the previous load" do
    it "treats every attribute the previous load had for other items as one it left blank" do
      policy = Policy.new({ "other" => { "content" => "x" } })

      # (nothing was loaded for this item last time, so anything now in the database was put there by someone else)
      assert_equal :skip,
                   policy.action_for(
                     Item.new("new_page", Model.new("Someone's work")),
                     Item.new("new_page"),
                     { "content" => "New" }
                   )
    end

    it "overwrites ones that are blank in the database" do
      policy = Policy.new({ "other" => { "content" => "x" } })

      assert_equal :overwrite,
                   policy.action_for(Item.new("new_page", Model.new(nil)), Item.new("new_page"), { "content" => "New" })
    end
  end
end
