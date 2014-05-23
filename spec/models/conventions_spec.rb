require 'spec_helper'
require File.expand_path('lib/domain_validator')

describe Convention do

  before(:each) do
    @attr = {
        :name => 'Example Convention',
        :domain => 'example.com'
    }
  end

  it 'should create a new instance given a valid attribute' do
    Convention.create!(@attr)
  end

  describe 'domain' do

    it 'should reject an empty domain' do
      no_domain = Convention.new(@attr.merge(:domain => ''))
      no_domain.should_not be_valid
      with_domain = Convention.new(@attr)
      with_domain.should be_valid
    end

    it 'should reject invalid domains' do

      domains = %w[foo foo,com foo. .com]
      domains.each do |domain|
        no_domain = Convention.new(@attr.merge(:domain => domain))
        no_domain.should_not be_valid
      end
    end

    it 'should reject a full address domain' do
      full_domain = Convention.new(@attr.merge(:domain => 'http://example.com'))
      full_domain.should_not be_valid
    end

    it 'should reject a duplicate domain' do
      Convention.create!(@attr)
      duplicate_domain = Convention.new(@attr)
      duplicate_domain.should_not be_valid
    end

    describe 'dates' do

      it 'should reject invalid dates' do

      end

      it 'should ' do

      end

    end

  end

end
