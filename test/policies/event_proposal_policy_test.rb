require 'test_helper'
require_relative 'convention_permissions_test_helper'

class EventProposalPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:event_proposal) { create(:event_proposal) }
  let(:event_category) { event_proposal.event_category }
  let(:convention) { event_proposal.convention }
  let(:rando) { create(:user_con_profile, convention: convention) }

  describe '#read?' do
    it 'lets staff users read event proposals' do
      user_con_profile = create(:staff_user_con_profile, convention: convention)
      assert EventProposalPolicy.new(user_con_profile.user, event_proposal).read?
    end

    it 'lets gm_liaison users read proposals past the proposed phase' do
      user_con_profile = create(:user_con_profile, convention: convention, gm_liaison: true)
      event_proposal.update!(status: 'reviewing')
      assert EventProposalPolicy.new(user_con_profile.user, event_proposal).read?
    end

    it 'lets users with read_pending_event_proposals read event proposals in the proposed phase' do
      user = create_user_with_read_pending_event_proposals_in_event_category(event_category)
      event_proposal.update!(status: 'proposed')
      assert EventProposalPolicy.new(user, event_proposal).read?
    end

    it 'lets users with read_event_proposals read event proposals past the proposed phase' do
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      event_proposal.update!(status: 'reviewing')
      assert EventProposalPolicy.new(user, event_proposal).read?
    end

    it 'does not let read_event_proposals users read event proposals past the proposed phase' do
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      event_proposal.update!(status: 'proposed')
      refute EventProposalPolicy.new(user, event_proposal).read?
    end

    it 'lets users read their own proposals' do
      assert EventProposalPolicy.new(event_proposal.owner.user, event_proposal).read?
    end

    it "does not let randos read other users' proposals" do
      refute EventProposalPolicy.new(rando.user, event_proposal).read?
    end
  end

  describe '#read_admin_notes?' do
    %w[gm_liaison staff].each do |priv|
      it "lets #{priv} users read admin notes on proposals" do
        user_con_profile = create(:user_con_profile, convention: convention, priv => true)
        assert EventProposalPolicy.new(user_con_profile.user, event_proposal).read_admin_notes?
      end
    end

    it 'lets users with convention-level access_admin_notes read admin notes on proposals' do
      user = create_user_with_access_admin_notes_in_convention(convention)
      assert EventProposalPolicy.new(user, event_proposal).read_admin_notes?
    end

    it 'lets users with access_admin_notes read admin notes on proposals' do
      user = create_user_with_access_admin_notes_in_event_category(event_category)
      assert EventProposalPolicy.new(user, event_proposal).read_admin_notes?
    end

    it 'does not let users read admin notes on their own proposals' do
      refute EventProposalPolicy.new(event_proposal.owner.user, event_proposal).read_admin_notes?
    end
  end

  describe '#create?' do
    it 'lets authenticated users create proposals' do
      assert EventProposalPolicy.new(rando.user, event_proposal).create?
    end

    it 'does not let anonymous users create proposals' do
      refute EventProposalPolicy.new(nil, event_proposal).create?
    end
  end

  describe '#update?' do
    (EventProposal::STATUSES - %w[draft]).each do |status|
      it "lets staff users update #{status} proposals" do
        event_proposal.update!(status: status)
        user_con_profile = create(:staff_user_con_profile, convention: convention)
        assert EventProposalPolicy.new(user_con_profile.user, event_proposal).update?
      end

      it "lets users with convention-level update_event_proposals update #{status} proposals" do
        event_proposal.update!(status: status)
        user = create_user_with_update_event_proposals_in_convention(convention)
        assert EventProposalPolicy.new(user, event_proposal).update?
      end

      it "lets users with update_event_proposals update #{status} proposals" do
        event_proposal.update!(status: status)
        user = create_user_with_update_event_proposals_in_event_category(event_category)
        assert EventProposalPolicy.new(user, event_proposal).update?
      end
    end

    %w[accepted withdrawn].each do |status|
      it "lets gm_liaison users update #{status} proposals" do
        event_proposal.update!(status: status)
        user_con_profile = create(:user_con_profile, convention: convention, gm_liaison: true)
        assert EventProposalPolicy.new(user_con_profile.user, event_proposal).update?
      end
    end

    (EventProposal::STATUSES - %w[accepted withdrawn]).each do |status|
      it "does not let gm_liaison users update #{status} proposals" do
        event_proposal.update!(status: status)
        user_con_profile = create(:user_con_profile, convention: convention, gm_liaison: true)
        refute EventProposalPolicy.new(user_con_profile.user, event_proposal).update?
      end
    end

    %w[draft proposed reviewing].each do |status|
      it "lets users update their own #{status} proposals" do
        event_proposal.update!(status: status)
        assert EventProposalPolicy.new(event_proposal.owner.user, event_proposal).update?
      end
    end

    (EventProposal::STATUSES - %w[draft proposed reviewing]).each do |status|
      it "does not let users update their own #{status} proposals" do
        event_proposal.update!(status: status)
        refute EventProposalPolicy.new(event_proposal.owner.user, event_proposal).update?
      end
    end

    it 'lets event team members update proposals' do
      AcceptEventProposalService.new(event_proposal: event_proposal).call!
      team_member = create(:team_member, event: event_proposal.event)
      assert EventProposalPolicy.new(team_member.user_con_profile.user, event_proposal).update?
    end

    it 'does not let randos update event proposals' do
      refute EventProposalPolicy.new(rando.user, event_proposal).update?
    end
  end

  describe '#update_admin_notes?' do
    %w[gm_liaison staff].each do |priv|
      it "lets #{priv} users update admin notes on proposals" do
        user_con_profile = create(:user_con_profile, convention: convention, priv => priv)
        assert EventProposalPolicy.new(user_con_profile.user, event_proposal).update_admin_notes?
      end
    end

    it 'lets users with convention-level access_admin_notes update admin notes on proposals' do
      user = create_user_with_access_admin_notes_in_convention(convention)
      assert EventProposalPolicy.new(user, event_proposal).update_admin_notes?
    end

    it 'lets users with access_admin_notes update admin notes on proposals' do
      user = create_user_with_access_admin_notes_in_event_category(event_category)
      assert EventProposalPolicy.new(user, event_proposal).update_admin_notes?
    end

    it 'does not let users update admin notes on their own proposals' do
      refute EventProposalPolicy.new(event_proposal.owner.user, event_proposal).update_admin_notes?
    end
  end

  describe '#destroy?' do
    it "does not let con staff destroy other users' proposals" do
      user_con_profile = create(:staff_user_con_profile, convention: convention)
      refute EventProposalPolicy.new(user_con_profile.user, event_proposal).destroy?
    end

    it 'lets users destroy their own draft proposals' do
      event_proposal.update!(status: 'draft')
      assert EventProposalPolicy.new(event_proposal.owner.user, event_proposal).destroy?
    end

    (EventProposal::STATUSES - ['draft']).each do |status|
      it "does not let users destroy their own #{status} proposals" do
        event_proposal.update!(status: status)
        refute EventProposalPolicy.new(event_proposal.owner.user, event_proposal).destroy?
      end
    end
  end

  describe '#submit?' do
    it "does not let con staff submit other users' proposals" do
      user_con_profile = create(:staff_user_con_profile, convention: convention)
      refute EventProposalPolicy.new(user_con_profile.user, event_proposal).submit?
    end

    it 'lets users submit their own proposals' do
      assert EventProposalPolicy.new(event_proposal.owner.user, event_proposal).submit?
    end

    it "does not let randos submit other users' proposals" do
      refute EventProposalPolicy.new(rando.user, event_proposal).submit?
    end
  end

  describe 'Scope' do
    let(:draft_proposal) do
      create(:event_proposal,
        convention: convention, event_category: event_category, status: 'draft'
      )
    end
    let(:proposed_proposal) do
      create(:event_proposal,
        convention: convention, event_category: event_category, status: 'proposed'
      )
    end
    let(:reviewing_proposal) do
      create(:event_proposal,
        convention: convention, event_category: event_category, status: 'reviewing'
      )
    end
    let(:other_category_reviewing_proposal) do
      create(:event_proposal, convention: convention, status: 'reviewing')
    end

    before do
      event_proposal
      draft_proposal
      proposed_proposal
      reviewing_proposal
      other_category_reviewing_proposal
    end

    it 'returns proposals past the proposed phase to gm_liaison users' do
      user_con_profile = create(:user_con_profile, convention: convention, gm_liaison: true)
      resolved_event_proposals = EventProposalPolicy::Scope.new(
        user_con_profile.user, EventProposal.all
      ).resolve

      assert_equal(
        [reviewing_proposal, other_category_reviewing_proposal].sort,
        resolved_event_proposals.sort
      )
    end

    it 'returns proposals past the proposed phase to users with read_event_proposals' do
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      resolved_event_proposals = EventProposalPolicy::Scope.new(user, EventProposal.all).resolve

      assert_equal(
        [reviewing_proposal].sort,
        resolved_event_proposals.sort
      )
    end

    it 'returns proposals past the draft phase to users with read_pending_event_proposals' do
      user = create_user_with_read_pending_event_proposals_in_event_category(event_category)
      resolved_event_proposals = EventProposalPolicy::Scope.new(user, EventProposal.all).resolve

      assert_equal(
        [event_proposal, reviewing_proposal, proposed_proposal].sort,
        resolved_event_proposals.sort
      )
    end

    it 'returns all your own proposals' do
      resolved_event_proposals = EventProposalPolicy::Scope.new(
        draft_proposal.owner.user, EventProposal.all
      ).resolve

      assert_equal(
        [draft_proposal].sort,
        resolved_event_proposals.sort
      )
    end

    it 'returns all proposals to staff users' do
      user_con_profile = create(:staff_user_con_profile, convention: convention)
      resolved_event_proposals = EventProposalPolicy::Scope.new(
        user_con_profile.user, EventProposal.all
      ).resolve

      assert_equal(
        [
          event_proposal, draft_proposal, proposed_proposal, reviewing_proposal,
          other_category_reviewing_proposal
        ].sort,
        resolved_event_proposals.sort
      )
    end
  end
end
