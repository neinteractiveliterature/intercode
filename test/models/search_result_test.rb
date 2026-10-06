# frozen_string_literal: true
require "test_helper"
require_relative "../policies/convention_permissions_test_helper"

class SearchResultTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention) }
  let(:anonymous) { AuthorizationInfo.new(nil, nil) }
  let(:admin) { AuthorizationInfo.new(create(:site_admin), nil) }

  def search(query, as: anonymous, convention_id: convention.id, **)
    SearchResult.full_text_site_search(query, convention_id, as, **)
  end

  def titles(result)
    result.entries.map(&:title)
  end

  describe ".full_text_site_search" do
    it "finds events by what they say" do
      create(:event, convention:, title: "Dragon Hunt")
      create(:event, convention:, title: "Garden Party")

      assert_equal ["Dragon Hunt"], titles(search("dragon"))
    end

    it "finds pages, by name" do
      create(:page, parent: convention, name: "Volunteer Information", content: "Please help us")

      assert_equal ["Volunteer Information"], titles(search("volunteer"))
    end

    it "searches only the given convention" do
      create(:event, convention:, title: "Dragon Hunt")
      create(:event, convention: create(:convention), title: "Dragon Chase")

      assert_equal ["Dragon Hunt"], titles(search("dragon"))
    end

    it "counts all the matches, even past the limit" do
      3.times { |n| create(:event, convention:, title: "Dragon #{n}") }

      result = search("dragon", limit: 2)

      assert_equal 3, result.total_entries
      assert_equal 2, result.entries.size
    end

    it "leaves out events that were dropped" do
      create(:event, convention:, title: "Dragon Hunt", status: "dropped")

      assert_empty search("dragon").entries
    end

    it "leaves out pages hidden from search" do
      create(:page, parent: convention, name: "Dragon Secrets", hidden_from_search: true)

      assert_empty search("dragon").entries
    end

    it "finds nothing for something that matches nothing" do
      create(:event, convention:, title: "Dragon Hunt")

      result = search("unicorn")

      assert_equal 0, result.total_entries
      assert_empty result.entries
    end
  end

  describe "attendees" do
    let(:attendee_user) { create(:user, first_name: "Zephyrina", last_name: "Wanderer") }

    before { create(:user_con_profile, convention:, user: attendee_user) }

    it "are hidden from the public" do
      assert_empty search("Zephyrina").entries
    end

    it "are hidden from other attendees" do
      other = create(:user_con_profile, convention:).user

      assert_empty search("Zephyrina", as: AuthorizationInfo.new(other, nil)).entries
    end

    it "are found by someone who can read them" do
      reader = create_user_with_permission_in_convention("read_user_con_profiles", convention)

      assert_equal ["Zephyrina Wanderer"], titles(search("Zephyrina", as: AuthorizationInfo.new(reader, nil)))
    end

    it "are found by site admins" do
      assert_equal ["Zephyrina Wanderer"], titles(search("Zephyrina", as: admin))
    end
  end

  describe "event proposals" do
    let(:proposal) do
      create(
        :event_proposal,
        convention:,
        event_category: create(:event_category, convention:),
        title: "Quixotic Quest"
      )
    end

    before { proposal.update!(status: "proposed") }

    it "are hidden from the public" do
      assert_empty search("Quixotic").entries
    end

    it "are found by site admins" do
      assert_equal ["Quixotic Quest"], titles(search("Quixotic", as: admin))
    end

    it "are hidden again once they are decided" do
      proposal.update!(status: "accepted")

      assert_empty search("Quixotic", as: admin).entries
    end
  end

  describe SearchResult::Entry do
    it "knows its model and how to describe it" do
      event = create(:event, convention:, title: "Dragon Hunt")

      entry = search("dragon").entries.first

      assert_equal event, entry.model
      assert_equal "Event", entry.model_type
      assert_equal "Dragon Hunt", entry.title
    end

    it "carries the highlight and rank from the search" do
      create(:event, convention:, title: "Dragon Hunt")

      entry = search("dragon").entries.first

      assert_includes entry.highlight, "Dragon"
      assert_kind_of Float, entry.rank.to_f
    end

    it "titles a page by its name and an attendee by their name without nickname" do
      create(:page, parent: convention, name: "Gallery Hours")
      create(
        :user_con_profile,
        convention:,
        user: create(:user, first_name: "Quentin", last_name: "Zimmer"),
        nickname: "Q"
      )

      assert_equal ["Gallery Hours"], titles(search("gallery"))
      assert_equal ["Quentin Zimmer"], titles(search("Quentin", as: admin))
    end

    it "falls back to the type and id for other kinds of thing" do
      entry = SearchResult::Entry.new(Struct.new(:searchable).new(create(:room, convention:)))

      assert_match(/\ARoom \d+\z/, entry.title)
    end
  end
end
