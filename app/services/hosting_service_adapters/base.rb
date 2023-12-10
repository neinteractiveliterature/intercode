class HostingServiceAdapters::Base
  ADAPTER_CLASSES = [HostingServiceAdapters::Fly, HostingServiceAdapters::Heroku, HostingServiceAdapters::Render]

  def self.find_adapter
    ADAPTER_CLASSES.map(&:new).find(&:applicable?)
  end

  def applicable?
    raise NotImplementedError, "HostingServiceAdapters::Base subclasses must implement #applicable?"
  end

  def fetch_instance_count
    raise NotImplementedError, "HostingServiceAdapters::Base subclasses must implement #fetch_instance_count"
  end

  def update_instance_count(instance_count)
    raise NotImplementedError, "HostingServiceAdapters::Base subclasses must implement #update_instance_count"
  end
end
