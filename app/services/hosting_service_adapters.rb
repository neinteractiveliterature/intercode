# frozen_string_literal: true
module HostingServiceAdapters
  ADAPTER_CLASSES = [HostingServiceAdapters::Fly].freeze

  def self.find_adapter
    ADAPTER_CLASSES.map(&:new).find(&:applicable?)
  end
end
