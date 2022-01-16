require 'test_helper'

describe CmsContentSet do
  it 'loads metadata from content sets' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    assert_equal ['standard'], content_set.metadata[:inherit]
  end
end
