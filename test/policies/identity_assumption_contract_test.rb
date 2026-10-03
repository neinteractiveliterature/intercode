# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

# Someone assuming another user's identity acts as that user in just one convention.  So for every policy
# that grants access based on who owns a record, assuming the owner's identity from a *different* convention
# must never grant access to anything.
#
# To add a policy that uses owned_by_user?, add it to RECORDS below.  This test fails if you forget.
class IdentityAssumptionContractTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  # Every ownership-based policy, with a way to build a record and find its owner.  The records are built to
  # be as open as possible to their owners (pending, moderated, ranked choice, etc.) so that any ownership
  # check that doesn't respect identity assumption has the best chance of being caught.
  RECORDS = {
    SignupPolicy => ->(test) { test.create(:signup, run: test.create_run) },
    SignupRequestPolicy => ->(test) { test.create(:signup_request, target_run: test.create_run) },
    SignupRankedChoicePolicy => ->(test) { test.create(:signup_ranked_choice, target_run: test.create_run) },
    SignupChangePolicy => ->(test) do
      test.create(:signup, run: test.create_run).log_signup_change!(action: "self_service_signup")
    end,
    RankedChoiceUserConstraintPolicy => ->(test) do
      test.create(
        :ranked_choice_user_constraint,
        user_con_profile: test.create(:user_con_profile, convention: test.convention)
      )
    end,
    OrderPolicy => ->(test) do
      test.create(:order, user_con_profile: test.create(:user_con_profile, convention: test.convention))
    end,
    OrderEntryPolicy => ->(test) do
      test.create(
        :order_entry,
        order: test.create(:order, user_con_profile: test.create(:user_con_profile, convention: test.convention))
      )
    end,
    TicketPolicy => ->(test) do
      test.create(:ticket, user_con_profile: test.create(:user_con_profile, convention: test.convention))
    end,
    UserConProfilePolicy => ->(test) { test.create(:user_con_profile, convention: test.convention) },
    EventProposalPolicy => ->(test) { test.create(:event_proposal, convention: test.convention, status: "draft") }
  }.freeze

  # Predicates that aren't actions on a record
  NON_ACTION_PREDICATES = %i[site_admin_read? site_admin_manage? site_admin? owned_by_user?].freeze

  # [policy, predicate] pairs that are intentionally available to anyone with the right record, regardless of
  # which identity they're assuming.  Keep this list short and explain each entry.
  EXEMPTIONS = [].freeze

  let(:convention) do
    create(:convention, :with_notification_templates, signup_mode: "moderated", signup_automation_mode: "ranked_choice")
  end

  def owner_of(record)
    return record.user if record.is_a?(UserConProfile)

    (record.try(:user_con_profile) || record.try(:owner) || record.try(:order)&.user_con_profile).user
  end

  def action_predicates(policy_class)
    (policy_class.public_instance_methods - ApplicationPolicy.public_instance_methods(false) + %i[read? manage?])
      .uniq
      .select { |name| name.end_with?("?") && policy_class.instance_method(name).arity.zero? }
      .reject { |name| NON_ACTION_PREDICATES.include?(name) }
      .select { |name| policy_class.instance_method(name).owner <= ApplicationPolicy }
  end

  RECORDS.each do |policy_class, build_record|
    describe policy_class.name do
      let(:record) { build_record.call(self) }
      let(:owner) { owner_of(record) }

      it "lets the owner do something with their own record (so that this test is checking something)" do
        assert(
          action_predicates(policy_class).any? { |predicate| policy_class.new(owner, record).public_send(predicate) }
        )
      end

      it "doesn't let an identity assumer from another convention do anything with the owner's record" do
        assumer = create_identity_assumer_from_other_convention(owner)
        allowed =
          action_predicates(policy_class).select do |predicate|
            policy_class.new(assumer, record).public_send(predicate) && EXEMPTIONS.exclude?([policy_class, predicate])
          end

        assert_empty allowed,
                     "#{policy_class.name} lets a cross-convention identity assumer do these with the owner's " \
                       "record: #{allowed.join(", ")}"
      end
    end
  end

  it "covers every policy that uses owned_by_user?" do
    using_helper =
      Rails
        .root
        .glob("app/policies/*_policy.rb")
        .select { |path| File.read(path).include?("owned_by_user?") }
        .map { |path| File.basename(path, ".rb").camelize.constantize }
        .reject { |policy_class| policy_class == ApplicationPolicy }

    assert_empty using_helper - RECORDS.keys,
                 "Add these policies to IdentityAssumptionContractTest::RECORDS: " \
                   "#{(using_helper - RECORDS.keys).join(", ")}"
  end

  def create_run
    create(:run, event: create(:event, convention:))
  end
end
