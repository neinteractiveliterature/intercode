# frozen_string_literal: true

class CachePageOgDescriptionJob < ApplicationJob
  def perform(page)
    page.update_column(:cached_og_description, page.compute_og_description) # rubocop:disable Rails/SkipsModelValidations
  end
end
