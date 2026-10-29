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

    describe "title prefix matches" do
      it "finds events by the start of a word in their title" do
        create(:event, convention:, title: "Privilege & The Sword")
        create(:event, convention:, title: "Garden Party")

        assert_equal ["Privilege & The Sword"], titles(search("pr"))
        assert_equal ["Privilege & The Sword"], titles(search("sw"))
      end

      it "ranks them above other matches, even better full text matches" do
        create(:event, convention:, title: "Garden Party", description: "dragon dragon dragon")
        create(:event, convention:, title: "Dragon Hunt", description: "filler " * 200)
        full_text_order = PgSearch.multisearch("dragon").with_pg_search_rank.map { |doc| doc.searchable.title }

        assert_equal "Garden Party", full_text_order.first, "full text search alone should prefer the other event"
        assert_equal ["Dragon Hunt", "Garden Party"], titles(search("dragon"))
      end

      it "doesn't repeat an event that matches both ways, and keeps its highlight" do
        create(:event, convention:, title: "Dragon Hunt", description: "Slay the dragon")

        result = search("dragon")

        assert_equal ["Dragon Hunt"], titles(result)
        assert_equal 1, result.total_entries
        assert_includes result.entries.first.highlight, "<mark>"
      end

      it "gives matches that full text search missed a rank and no highlight" do
        create(:event, convention:, title: "Privilege & The Sword")

        entry = search("pr").entries.first

        assert_nil entry.highlight
        assert_equal 0.0, entry.rank.to_f
      end

      it "counts them along with the other matches, and respects the limit" do
        create(:event, convention:, title: "Dragon Hunt")
        create(:event, convention:, title: "Dragonfly Watching")
        create(:event, convention:, title: "Garden Party", description: "dragon")

        result = search("dragon", limit: 2)

        assert_equal 3, result.total_entries
        assert_equal 2, result.entries.size
        assert_equal ["Dragon Hunt", "Dragonfly Watching"], titles(result).sort
      end

      it "finds pages by the start of a word in their name" do
        create(:page, parent: convention, name: "Volunteer Information", content: "Please help us")
        create(:page, parent: convention, name: "Gallery Hours")

        assert_equal ["Volunteer Information"], titles(search("vol"))
        assert_equal ["Volunteer Information"], titles(search("info"))
      end

      it "ranks page name matches above other matches" do
        create(:event, convention:, title: "Garden Party", description: "volunteering volunteering volunteering")
        create(:page, parent: convention, name: "Volunteer Information", content: "filler " * 200)

        assert_equal ["Volunteer Information", "Garden Party"], titles(search("volunteer"))
      end

      it "leaves out pages hidden from search and pages from other conventions" do
        create(:page, parent: convention, name: "Volunteer Secrets", hidden_from_search: true)
        create(:page, parent: create(:convention), name: "Volunteer Information")

        assert_empty search("vol").entries
      end

      it "finds site pages when searching outside a convention" do
        page = create(:page, parent: RootSite.instance || create(:root_site), name: "Terms of Service")

        assert_equal [page.name], titles(search("ter", convention_id: nil))
      end

      it "leaves out events from other conventions and dropped events" do
        create(:event, convention: create(:convention), title: "Privilege & The Sword")
        create(:event, convention:, title: "Prince of Thieves", status: "dropped")

        assert_empty search("pr").entries
      end
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

    describe "by the start of a first or last name" do
      let(:reader) do
        AuthorizationInfo.new(create_user_with_permission_in_convention("read_user_con_profiles", convention), nil)
      end

      it "are found by someone who can read them" do
        assert_equal ["Zephyrina Wanderer"], titles(search("zeph", as: reader))
        assert_equal ["Zephyrina Wanderer"], titles(search("wand", as: reader))
        assert_equal ["Zephyrina Wanderer"], titles(search("zeph wan", as: reader))
      end

      it "are hidden from the public and from other attendees" do
        other = AuthorizationInfo.new(create(:user_con_profile, convention:).user, nil)

        assert_empty search("zeph").entries
        assert_empty search("zeph", as: other).entries
      end

      it "rank above other matches" do
        create(:event, convention:, title: "Zephyr Hunt", description: "zephyrina zephyrina zephyrina")

        assert_equal ["Zephyrina Wanderer", "Zephyr Hunt"], titles(search("zephyrina", as: admin))
      end

      it "leaves out attendees of other conventions" do
        create(
          :user_con_profile,
          convention: create(:convention),
          user: create(:user, first_name: "Zeppo", last_name: "Marx")
        )

        assert_equal ["Zephyrina Wanderer"], titles(search("zep", as: admin))
      end
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
