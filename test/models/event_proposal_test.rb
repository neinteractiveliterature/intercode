# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: event_proposals
#
#  id                     :bigint           not null, primary key
#  additional_info        :jsonb
#  admin_notes            :text
#  can_play_concurrently  :boolean
#  description            :text
#  email                  :text
#  length_seconds         :integer
#  reminded_at            :datetime
#  short_blurb            :text
#  status                 :string
#  submitted_at           :datetime
#  team_mailing_list_name :text
#  timeblock_preferences  :jsonb
#  title                  :text
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  convention_id          :bigint
#  event_category_id      :bigint           not null
#  event_id               :bigint
#  owner_id               :bigint
#  registration_policy_id :bigint
#
# Indexes
#
#  index_event_proposals_on_convention_id           (convention_id)
#  index_event_proposals_on_event_category_id       (event_category_id)
#  index_event_proposals_on_event_id                (event_id)
#  index_event_proposals_on_owner_id                (owner_id)
#  index_event_proposals_on_registration_policy_id  (registration_policy_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_category_id => event_categories.id)
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (owner_id => user_con_profiles.id)
#  fk_rails_...  (registration_policy_id => registration_policies.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class EventProposalTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:event_proposal) do
    create(
      :event_proposal,
      convention:,
      registration_policy: RegistrationPolicy.build_from_hash(buckets: [{ key: "unlimited", name: "Signups" }])
    )
  end

  describe "registration_policy_id uniqueness" do
    it "rejects a second event proposal pointing at the same registration_policy row" do
      other_proposal = build(:event_proposal, convention:, registration_policy: event_proposal.registration_policy)
      assert_raises(ActiveRecord::RecordNotUnique) { other_proposal.save!(validate: false) }
    end
  end
end
