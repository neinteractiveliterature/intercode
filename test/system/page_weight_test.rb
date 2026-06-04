# frozen_string_literal: true

require "application_system_test_case"

class PageWeightTest < ApplicationSystemTestCase
  # Maximum compressed (gzip) bytes for the combined JS + CSS payload on the
  # initial root-page load, as reported by PerformanceResourceTiming#transferSize.
  #
  # Without a large eagerly-loaded dependency like Monaco editor, the initial
  # payload is well under 500 KB compressed. With Monaco in the initial bundle
  # (the regression this guards against), it exceeds 900 KB. The threshold is
  # intentionally set between those two states with headroom on each side.
  INITIAL_ASSET_THRESHOLD_BYTES = 700_000
  ASSET_INITIATOR_TYPES = %w[script link].freeze

  let(:convention) { create(:convention, :with_standard_content) }

  before { Intercode.overridden_virtual_host_domain = convention.domain }
  after { Intercode.overridden_virtual_host_domain = nil }

  it "loads the home page within the initial JS/CSS payload budget" do
    visit "/"

    # Wait for the React app to finish bootstrapping before sampling resources.
    assert page.has_css?("nav.navbar"), wait: 15

    resources = JSON.parse(page.evaluate_script(<<~JS))
        JSON.stringify(
          performance.getEntriesByType("resource").map(function(e) {
            return {
              name: e.name.replace(/^.*\\//, ""),
              initiatorType: e.initiatorType,
              transferSize: e.transferSize
            };
          })
        )
      JS

    initial_assets = resources.select { |r| ASSET_INITIATOR_TYPES.include?(r["initiatorType"]) }
    total_bytes = initial_assets.sum { |r| r["transferSize"] }

    assert total_bytes <= INITIAL_ASSET_THRESHOLD_BYTES, budget_failure_message(total_bytes, initial_assets)
  end

  private

  def budget_failure_message(total_bytes, assets)
    top_files =
      assets
        .sort_by { |r| -r["transferSize"] }
        .first(10)
        .map { |r| "  #{human_bytes(r["transferSize"]).rjust(10)}  #{r["name"]}" }
        .join("\n")

    "Initial JS + CSS payload is #{human_bytes(total_bytes)} " \
      "(limit: #{human_bytes(INITIAL_ASSET_THRESHOLD_BYTES)}). " \
      "A large dependency may have snuck into the initial bundle.\n\n" \
      "Largest files:\n#{top_files}"
  end

  def human_bytes(bytes)
    return "#{bytes} B" if bytes < 1024
    return "#{(bytes / 1024.0).round(1)} KB" if bytes < 1_048_576

    "#{(bytes / 1_048_576.0).round(2)} MB"
  end
end
