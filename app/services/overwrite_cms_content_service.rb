# frozen_string_literal: true
class OverwriteCmsContentService < CivilService::Service
  def initialize(convention:, content_set_name:)
    @convention = convention
    @content_set_name = content_set_name
  end

  private

  def inner_call
    ActiveRecord::Base.transaction do
      ClearCmsContentService.new(convention: @convention).call!
      LoadCmsContentSetService.new(convention: @convention, content_set_name: @content_set_name).call!

      success
    end
  rescue CivilService::ServiceFailure => e
    e.result
  end
end
