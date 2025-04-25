# frozen_string_literal: true
class SyncEmailForwardingForDomainJob < ApplicationJob
  def perform(domains)
    mappings_by_domain = EmailForwardingRouter.all_mappings_for_domains(Array(domains)).by_domain

    return if ENV["FORWARDEMAIL_API_KEY"].blank?
    SyncForwardEmailService.new(mappings_by_domain:).call!
  end
end
