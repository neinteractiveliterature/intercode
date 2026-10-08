# frozen_string_literal: true
require "test_helper"

class MailingListsPresenterTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:presenter) { MailingListsPresenter.new(convention) }

  describe "#team_members" do
    let(:category_a) { create(:event_category, convention:) }
    let(:category_b) { create(:event_category, convention:) }
    let(:event_a) { create(:event, convention:, event_category: category_a, con_mail_destination: "gms") }
    let(:event_b) { create(:event, convention:, event_category: category_b, con_mail_destination: "gms") }
    let(:team_member_a) { create(:team_member, event: event_a, receive_con_email: true) }
    let(:team_member_b) { create(:team_member, event: event_b, receive_con_email: true) }

    before do
      team_member_a
      team_member_b
    end

    it "includes team members from all event categories by default" do
      emails = presenter.team_members.emails.map(&:email)
      assert_equal [team_member_a.user_con_profile.email, team_member_b.user_con_profile.email].sort, emails.sort
    end

    it "only includes team members from the given event category" do
      emails = presenter.team_members(event_category_ids: [category_a.id]).emails.map(&:email)
      assert_equal [team_member_a.user_con_profile.email], emails
    end

    it "includes team members from all of the given event categories" do
      emails = presenter.team_members(event_category_ids: [category_a.id, category_b.id]).emails.map(&:email)
      assert_equal [team_member_a.user_con_profile.email, team_member_b.user_con_profile.email].sort, emails.sort
    end

    it "accepts event category IDs as strings" do
      emails = presenter.team_members(event_category_ids: [category_b.id.to_s]).emails.map(&:email)
      assert_equal [team_member_b.user_con_profile.email], emails
    end

    it "treats an empty list of event category IDs as no filter" do
      assert_equal 2, presenter.team_members(event_category_ids: []).emails.size
    end
  end
end
