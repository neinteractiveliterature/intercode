# frozen_string_literal: true
# A set of rules for a pay-what-you-want pricing structure
class PayWhatYouWantValueDrop < Liquid::Drop
  # @api
  attr_reader :value

  def initialize(value)
    @value = value
  end

  delegate :minimum_amount, :maximum_amount, :suggested_amount, to: :value
end
