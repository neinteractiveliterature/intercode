# frozen_string_literal: true
require "test_helper"

# Policies must not compare user IDs by hand to decide whether the current user owns a record: use
# ApplicationPolicy#owned_by_user? instead, which makes sure identity assumers aren't treated as the owner of
# anything outside the convention whose identity they're assuming.  (Authorization that goes through
# has_convention_permission? gets this for free, but raw comparisons don't.)
class OwnershipChecksTest < ActiveSupport::TestCase
  RAW_USER_ID_COMPARISON = /(user_id|user&?\.id)\s*==|==\s*(actual_user|user)&?\.id/

  # Lines that are allowed to compare user IDs by hand, because they deliberately don't use the same rules as
  # owned_by_user?.  Keep this list short and explain each entry.
  EXEMPTIONS = [
    # The implementation of owned_by_user? itself
    ["application_policy.rb", /user_con_profile\.user_id == user\.id/],
    # Event ratings are secret from identity assumers, so they intentionally compare against the real user
    ["event_rating_policy.rb", /actual_user/],
    # Anyone can always read and manage their own real profile, regardless of identity assumption
    ["user_con_profile_policy.rb", /actual_user/]
  ].freeze

  it "has no raw user ID comparisons in policies other than the explicitly exempted ones" do
    violations =
      Rails
        .root
        .glob("app/policies/**/*_policy.rb")
        .flat_map do |path|
          File
            .readlines(path)
            .each_with_index
            .filter_map do |line, index|
              next unless line.match?(RAW_USER_ID_COMPARISON)
              next if EXEMPTIONS.any? { |file, pattern| path.to_s.end_with?(file) && line.match?(pattern) }

              "#{path.relative_path_from(Rails.root)}:#{index + 1}: #{line.strip}"
            end
        end

    assert_empty violations, <<~MESSAGE
      Use owned_by_user?(user_con_profile) instead of comparing user IDs by hand, so that identity assumers
      from other conventions aren't treated as the owner:
      #{violations.join("\n")}
    MESSAGE
  end
end
