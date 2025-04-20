# frozen_string_literal: true
class SyncEmailForwardingForDomainJob < ApplicationJob
  def perform(domains)
    mappings_by_domain = EmailForwardingRouter.all_mappings.by_domain.slice(*domains)

    return if ENV["FORWARDEMAIL_API_KEY"].blank?
    SyncForwardEmailService.new(mappings_by_domain:).call!
  end
end
