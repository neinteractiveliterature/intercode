module HostingServiceAdapters
  ADAPTER_CLASSES = [HostingServiceAdapters::Fly, HostingServiceAdapters::Heroku]

  def self.find_adapter
    ADAPTER_CLASSES.map(&:new).find(&:applicable?)
  end
end
