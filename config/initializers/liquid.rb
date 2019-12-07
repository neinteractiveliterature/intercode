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
