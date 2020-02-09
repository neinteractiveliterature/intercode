require 'test_helper'

class IntercodeSchemaTest < ActiveSupport::TestCase
  it 'generates a schema definition without throwing an exception' do
    definition = IntercodeSchema.to_definition
    assert_match /type Query/, definition
  end
end
