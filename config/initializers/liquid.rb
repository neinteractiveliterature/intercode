require 'intercode/liquid/tags'
require 'intercode/liquid/filters'

# In development and test mode, expose the actual exception to developers if there is one
if Rails.env.development? || Rails.env.test?
  Liquid::Template.default_exception_renderer = ->(exception) do
    exception.is_a?(Liquid::InternalError) ? "Liquid error: #{ERB::Util.html_escape exception.cause.message}" : exception
  end
end

# Patching Money and Money::Currency to convert to our Liquid drops
require 'money'
class Money
  def to_liquid
    MoneyDrop.new(self)
  end
end

class Money::Currency
  def to_liquid
    Money::CurrencyDrop.new(self)
  end
end

class ScheduledValue::Timespan
  def to_liquid
    ScheduledValue::TimespanDrop.new(self)
  end
end

# Patching Liquid::Utils to use ActiveSupport time zone
module Liquid::Utils
  def self.to_date(obj)
    return obj if obj.respond_to?(:strftime)

    if obj.is_a?(String)
      return nil if obj.empty?
      obj = obj.downcase
    end

    case obj
    when 'now'.freeze, 'today'.freeze
      Time.zone.now
    when /\A\d+\z/, Integer
      Time.zone.at(obj.to_i)
    when String
      Time.zone.parse(obj)
    end
  rescue ::ArgumentError
    nil
  end
end
