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

        expected_destinations = [user1.email, user2.email, "cc@example.com"].map do |addr|
          EmailRoute.normalize_address(addr)
        end

        assert_equal expected_destinations.sort, primary_mapping.destination_addresses.sort
        assert_equal expected_destinations.sort, help_mapping.destination_addresses.sort
        assert_equal expected_destinations.sort, support_mapping.destination_addresses.sort
      end
    end

    describe "without email aliases" do
      let(:staff_position) do
        create(
          :staff_position,
          convention:,
          email: "staff@example.com",
          email_aliases: []
        )
      end

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
        create(
          :staff_position,
          convention:,
          email: "staff1@example.com",
          email_aliases: %w[help support]
        )
      end

      let(:staff_position2) do
        create(
          :staff_position,
          convention:,
          email: "staff2@example.com",
          email_aliases: ["info"]
        )
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
end
