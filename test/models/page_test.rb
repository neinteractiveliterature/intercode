# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: pages
#
#  id                       :bigint           not null, primary key
#  admin_notes              :text
#  cached_og_description    :text
#  content                  :text
#  hidden_from_search       :boolean          default(FALSE), not null
#  invariant                :boolean          default(FALSE), not null
#  meta_description         :text
#  name                     :text
#  parent_type              :string
#  skip_clickwrap_agreement :boolean          default(FALSE), not null
#  slug                     :string
#  created_at               :datetime
#  updated_at               :datetime
#  cms_layout_id            :bigint
#  parent_id                :bigint
#
# Indexes
#
#  index_pages_on_cms_layout_id                       (cms_layout_id)
#  index_pages_on_parent_type_and_parent_id_and_slug  (parent_type,parent_id,slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (cms_layout_id => cms_layouts.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class PageTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention) }

  describe "#compute_og_description" do
    it "strips HTML tags and truncates to 160 characters" do
      page = create(:page, parent: convention, content: "<p>#{"a" * 200}</p>")
      result = page.compute_og_description
      assert_equal 160, result.length
      assert_no_match(%r{</?p>}, result)
    end

    it "returns the plain text content for short pages" do
      page = create(:page, parent: convention, content: "Hello world")
      assert_equal "Hello world", page.compute_og_description
    end

    it "returns an empty string if rendering raises" do
      page = create(:page, parent: convention, content: "Hello world")
      CmsContentFinder.stub(:new, ->(*) { raise "boom" }) { assert_equal "", page.compute_og_description }
    end
  end

  describe "after save" do
    it "enqueues CachePageOgDescriptionJob on create" do
      assert_enqueued_with(job: CachePageOgDescriptionJob) { create(:page, parent: convention) }
    end

    it "enqueues CachePageOgDescriptionJob on update" do
      page = create(:page, parent: convention)
      assert_enqueued_with(job: CachePageOgDescriptionJob) { page.update!(name: "Updated") }
    end
  end
end
