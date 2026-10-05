# frozen_string_literal: true
require "test_helper"

class EmailForwardingRouterTest < ActiveSupport::TestCase
  let(:convention) { create(:convention, domain: "example.com") }
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:user_con_profile1) { create(:user_con_profile, convention:, user: user1) }
  let(:user_con_profile2) { create(:user_con_profile, convention:, user: user2) }

  describe "all_staff_position_mappings" do
    describe "with email aliases" do
      let(:staff_position) do
        create(
          :staff_position,
          convention:,
          email: "staff@example.com",
          email_aliases: %w[help support],
          cc_addresses: ["cc@example.com"]
        )
      end

      setup do
        staff_position.user_con_profiles << user_con_profile1
        staff_position.user_con_profiles << user_con_profile2
      end

      it "creates mappings for the primary email and all aliases" do
        mappings = EmailForwardingRouter.all_staff_position_mappings
        mapping_emails = mappings.values.map(&:inbound_email)

        assert_includes mapping_emails, "staff@example.com"
        assert_includes mapping_emails, "help@example.com"
        assert_includes mapping_emails, "support@example.com"
      end

      it "maps all aliases to the same destination addresses" do
        mappings = EmailForwardingRouter.all_staff_position_mappings
        primary_mapping = mappings.values.find { |m| m.inbound_email == "staff@example.com" }
        help_mapping = mappings.values.find { |m| m.inbound_email == "help@example.com" }
        support_mapping = mappings.values.find { |m| m.inbound_email == "support@example.com" }

        expected_destinations =
          [user1.email, user2.email, "cc@example.com"].map { |addr| EmailRoute.normalize_address(addr) }

        assert_equal expected_destinations.sort, primary_mapping.destination_addresses.sort
        assert_equal expected_destinations.sort, help_mapping.destination_addresses.sort
        assert_equal expected_destinations.sort, support_mapping.destination_addresses.sort
      end
    end

    describe "without email aliases" do
      let(:staff_position) { create(:staff_position, convention:, email: "staff@example.com", email_aliases: []) }

      setup { staff_position.user_con_profiles << user_con_profile1 }

      it "creates only the primary email mapping" do
        mappings = EmailForwardingRouter.all_staff_position_mappings
        mapping_emails = mappings.values.map(&:inbound_email)

        assert_includes mapping_emails, "staff@example.com"
        assert_equal 1, mapping_emails.count("staff@example.com")
      end
    end

    describe "with multiple staff positions with aliases" do
      let(:staff_position1) do
        create(:staff_position, convention:, email: "staff1@example.com", email_aliases: %w[help support])
      end

      let(:staff_position2) do
        create(:staff_position, convention:, email: "staff2@example.com", email_aliases: ["info"])
      end

      setup do
        staff_position1.user_con_profiles << user_con_profile1
        staff_position2.user_con_profiles << user_con_profile2
      end

      it "creates all mappings for both staff positions" do
        mappings = EmailForwardingRouter.all_staff_position_mappings
        mapping_emails = mappings.values.map(&:inbound_email)

        # staff_position1 mappings
        assert_includes mapping_emails, "staff1@example.com"
        assert_includes mapping_emails, "help@example.com"
        assert_includes mapping_emails, "support@example.com"

        # staff_position2 mappings
        assert_includes mapping_emails, "staff2@example.com"
        assert_includes mapping_emails, "info@example.com"

        assert_equal 5, mapping_emails.size
      end
    end
  end

  describe "deduplication" do
    let(:staff_position) do
      create(
        :staff_position,
        convention:,
        email: "staff@example.com",
        cc_addresses: %w[email.address1@example.com Email.Address1@example.com]
      )
    end

    setup { staff_position }

    it "deduplicates email addresses but does not modify them" do
      mappings = EmailForwardingRouter.all_staff_position_mappings

      assert_equal 1, mappings.values.size
      assert_equal ["email.address1@example.com"], mappings.values.first.destination_addresses.map(&:downcase)
    end
  end

  def staff_position_with_members(emails, **attrs)
    staff_position = create(:staff_position, convention:, **attrs)
    emails.each do |email|
      staff_position.user_con_profiles << create(:user_con_profile, convention:, user: create(:user, email:))
    end
    staff_position
  end

  describe "all_catch_all_mappings" do
    it "maps the whole domain to the catch-all staff position's members and cc addresses" do
      staff_position = staff_position_with_members(%w[member@gmail.com], cc_addresses: ["cc@gmail.com"])
      convention.update!(catch_all_staff_position: staff_position)

      mappings = EmailForwardingRouter.all_catch_all_mappings.values

      assert_equal 1, mappings.size
      assert_predicate mappings.first, :catch_all?
      assert_equal "example.com", mappings.first.inbound_domain
      assert_equal %w[cc@gmail.com member@gmail.com], mappings.first.destination_addresses.sort
    end

    it "leaves out a catch-all position that has nobody to forward to" do
      convention.update!(catch_all_staff_position: create(:staff_position, convention:))

      assert_empty EmailForwardingRouter.all_catch_all_mappings.values
    end

    it "ignores conventions without a catch-all" do
      convention

      assert_empty EmailForwardingRouter.all_catch_all_mappings.values
    end
  end

  describe "all_team_member_mappings" do
    it "maps each event's team mailing list to its team members" do
      convention.update!(event_mailing_list_domain: "events.example.com")
      event = create(:event, convention:, team_mailing_list_name: "bigGame")
      2.times do |i|
        create(
          :team_member,
          event:,
          user_con_profile: create(:user_con_profile, convention:, user: create(:user, email: "gm#{i}@gmail.com"))
        )
      end

      mappings = EmailForwardingRouter.all_team_member_mappings.values

      assert_equal ["biggame@events.example.com"], mappings.map(&:inbound_email)
      assert_equal %w[gm0@gmail.com gm1@gmail.com], mappings.first.destination_addresses.sort
    end

    it "leaves out events without a team mailing list name, and conventions without an events domain" do
      create(:event, convention:, team_mailing_list_name: "nolistdomain")
      convention.update!(event_mailing_list_domain: "events.example.com")
      create(:event, convention:, team_mailing_list_name: nil)

      assert_empty(EmailForwardingRouter.all_team_member_mappings.values.select { |m| m.inbound_local.blank? })
    end
  end

  describe "all_email_route_mappings" do
    it "maps each email route that has forward addresses" do
      EmailRoute.create!(receiver_address: "route@example.com", forward_addresses: %w[x@gmail.com y@gmail.com])

      mappings = EmailForwardingRouter.all_email_route_mappings.values

      assert_equal ["route@example.com"], mappings.map(&:inbound_email)
      assert_equal %w[x@gmail.com y@gmail.com], mappings.first.destination_addresses.sort
    end

    it "leaves out email routes with no forward addresses" do
      EmailRoute.create!(receiver_address: "empty@example.com", forward_addresses: [])

      assert_empty EmailForwardingRouter.all_email_route_mappings.values
    end
  end

  describe "all_mappings_for_domains" do
    it "gives the mappings for just those domains, from every source" do
      staff_position_with_members(%w[member@gmail.com], email: "staff@example.com")
      EmailRoute.create!(receiver_address: "route@example.com", forward_addresses: ["x@gmail.com"])
      other = create(:convention, domain: "other.example.org")
      create(:staff_position, convention: other, email: "staff@other.example.org")
      EmailRoute.create!(receiver_address: "route@elsewhere.net", forward_addresses: ["x@gmail.com"])

      mappings = EmailForwardingRouter.all_mappings_for_domains(["example.com"])

      assert_equal %w[route@example.com staff@example.com], mappings.values.map(&:inbound_email).sort
      assert_equal ["example.com"], mappings.by_domain.keys
    end
  end

  describe "forward_addresses for a recipient" do
    it "gives the members and cc addresses of the staff position with that address, or one of its aliases" do
      staff_position_with_members(
        %w[member@gmail.com],
        email: "staff@example.com",
        email_aliases: %w[help],
        cc_addresses: ["cc@gmail.com"]
      )

      assert_equal %w[member@gmail.com cc@gmail.com], EmailForwardingRouter.new("staff@example.com").forward_addresses
      assert_equal %w[member@gmail.com cc@gmail.com], EmailForwardingRouter.new("Help@Example.com").forward_addresses
    end

    it "falls back to the catch-all staff position when no position matches" do
      convention.update!(catch_all_staff_position: staff_position_with_members(%w[catchall@gmail.com]))
      staff_position_with_members(%w[member@gmail.com], email: "staff@example.com")

      assert_equal ["catchall@gmail.com"], EmailForwardingRouter.new("nobody@example.com").forward_addresses
    end

    it "sends everything to the catch-all when the convention is in staff_emails_to_catch_all mode" do
      convention.update!(
        catch_all_staff_position: staff_position_with_members(%w[catchall@gmail.com]),
        email_mode: "staff_emails_to_catch_all"
      )
      staff_position_with_members(%w[member@gmail.com], email: "staff@example.com")

      assert_equal ["catchall@gmail.com"], EmailForwardingRouter.new("staff@example.com").forward_addresses
    end

    it "gives nothing for a domain that isn't a convention's, and nothing when there is no catch-all" do
      staff_position_with_members(%w[member@gmail.com], email: "staff@example.com")

      assert_empty EmailForwardingRouter.new("someone@elsewhere.net").forward_addresses
      assert_empty EmailForwardingRouter.new("nobody@example.com").forward_addresses
    end

    it "gives an event's team members for its team mailing list address" do
      convention.update!(event_mailing_list_domain: "events.example.com")
      event = create(:event, convention:, team_mailing_list_name: "bigGame")
      create(
        :team_member,
        event:,
        user_con_profile: create(:user_con_profile, convention:, user: create(:user, email: "gm@gmail.com"))
      )

      assert_equal ["gm@gmail.com"], EmailForwardingRouter.new("BigGame@events.example.com").forward_addresses
      assert_empty EmailForwardingRouter.new("other@events.example.com").forward_addresses
    end

    it "gives an email route's forward addresses, without duplicates" do
      EmailRoute.create!(receiver_address: "route@example.com", forward_addresses: %w[x@gmail.com y@gmail.com])
      convention.update!(catch_all_staff_position: staff_position_with_members(%w[x@gmail.com]))

      assert_equal %w[x@gmail.com y@gmail.com], EmailForwardingRouter.new("route@example.com").forward_addresses
    end
  end
end
